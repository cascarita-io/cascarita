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
  network_mode = "host"
  cpu          = 1024
  memory = 2048

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "ARM64"
  }
  container_definitions = jsonencode([
    {
      name      = var.client_container
      image     = var.client_container_image
      cpu       = var.cpu_allocation
      memory    = var.memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = var.client_port
          hostPort      = var.client_port
          protocol      = "tcp"
        },
        {
          containerPort = 443            # HTTPS port
          hostPort      = 443            # HTTPS port
          protocol      = "tcp"
        }
      ]
    },
    {
      name      = var.server_container
      image     = var.server_container_image
      cpu       = var.cpu_allocation
      memory    = var.memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = var.server_port
          hostPort      = var.server_port
        }
      ]
      # TODO: Externally add env variables rather than keep in container
      # environment = [
      #   {
      #     name  = "NODE_ENV"
      #     value = "production"
      #   }
      # ]
    },
    {
      name      = "traefik"
      image     = "traefik:v2.10"
      cpu       = var.cpu_allocation
      memory    = var.memory_allocation
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        },
        {
          containerPort = 8081
          hostPort      = 8081
        }
      ]
      command = [
        "--api.insecure=true",
        "--providers.docker=true",
        "--entrypoints.web.address=:3000"
      ]
      volumesFrom = [
        {
          sourceContainer = var.server_container
        },
        {
          sourceContainer = var.client_container
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
    container_name   = var.client_container
    container_port   = var.client_port
  }

  tags = {
    Name        = local.service_name
    Environment = var.environment
    Project     = var.project_name
  }

  depends_on = [aws_autoscaling_group.ecs_asg]
}
