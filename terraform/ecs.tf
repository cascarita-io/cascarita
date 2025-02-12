resource "aws_ecs_cluster" "ecs_cluster" {
  name = local.cluster_name

  tags = {
    Name        = local.cluster_name
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_capacity_provider" "ecs_capacity_provider" {
  name = local.capacity_provider_name

  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.ecs_asg.arn

    managed_scaling {
      maximum_scaling_step_size = 1000
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = var.target_capacity
    }
  }

  tags = {
    Name        = local.capacity_provider_name
    Environment = var.environment
    Project     = var.project_name
  }
}

resource "aws_ecs_cluster_capacity_providers" "example" {
  cluster_name = aws_ecs_cluster.ecs_cluster.name

  capacity_providers = [aws_ecs_capacity_provider.ecs_capacity_provider.name]

  default_capacity_provider_strategy {
    base              = 1
    weight            = 100
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
  }
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family       = local.task_family_name
  network_mode = "bridge"

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
  container_definitions = jsonencode([
    {
      name = var.proxy_container
      image = var.proxy_container_image
      cpu = var.low_cpu_allocation
      memory = var.low_memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = var.proxy_port
          hostPort = var.proxy_port
          protocol = "tcp"
        },
        {
          containerPort = 443
          hostPort = 443
          protocol = "tcp"
        }
      ],
      links = [var.client_container, var.server_container]
    },
    {
      name      = var.client_container
      image     = var.client_container_image
      cpu       = var.low_cpu_allocation
      memory    = var.high_memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = var.client_port
          hostPort      = var.client_port
          protocol      = "tcp"
        }
      ]
    },
    {
      name      = var.server_container
      image     = var.server_container_image
      cpu       = var.low_cpu_allocation
      memory    = var.medium_memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = var.server_port
          hostPort      = var.server_port
        }
      ]
    }
  ])

  tags = {
    Name        = local.task_family_name
    Environment = var.environment
    Project     = var.project_name
  }

  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
}

resource "aws_ecs_service" "ecs_service" {
  name            = local.service_name
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count   = var.desired_count

  network_configuration {
    subnets          = [aws_subnet.subnet.id, aws_subnet.subnet2.id]
    security_groups  = [aws_security_group.security_group.id]
  }

  force_new_deployment = true
  placement_constraints {
    type = "distinctInstance"
  }

  triggers = {
    redeployment = aws_ecs_task_definition.ecs_task_definition.revision
  }

  capacity_provider_strategy {
    capacity_provider = aws_ecs_capacity_provider.ecs_capacity_provider.name
    weight            = 100
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.ecs_tg.arn
    container_name   = var.proxy_container
    container_port   = var.proxy_port
  }

  tags = {
    Name        = local.service_name
    Environment = var.environment
    Project     = var.project_name
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}
