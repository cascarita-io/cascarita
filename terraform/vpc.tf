provider "aws" {
  profile = var.aws_profile
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  tags = {
    Name        = local.vpc_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }
}

resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 1)
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zones[0]
  tags = {
    Name        = local.subnet_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }
}

resource "aws_subnet" "subnet2" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, 2)
  map_public_ip_on_launch = true
  availability_zone       = var.availability_zones[1]
  tags = {
    Name        = local.subnet2_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }
}
resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.main.id
  tags = {
    Name        = local.internet_gateway_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }
}

resource "aws_route_table" "route_table" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gateway.id
  }
  tags = {
    Name        = local.route_table_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }

  depends_on = [
    aws_autoscaling_group.ecs_asg,
    aws_internet_gateway.internet_gateway
  ]
}

resource "aws_route_table_association" "subnet_route" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.route_table.id
  depends_on = [
    aws_route_table.route_table,
    aws_internet_gateway.internet_gateway
  ]
}

resource "aws_route_table_association" "subnet2_route" {
  subnet_id      = aws_subnet.subnet2.id
  route_table_id = aws_route_table.route_table.id
  depends_on = [
    aws_route_table.route_table,
    aws_internet_gateway.internet_gateway
  ]
}

resource "aws_security_group" "security_group" {
  name   = local.security_group_name
  vpc_id = aws_vpc.main.id

  ingress {
   from_port   = 0
   to_port     = 0
   protocol    = -1
   self        = "false"
   cidr_blocks = ["0.0.0.0/0"]
   description = "any"
 }

 egress {
   from_port   = 0
   to_port     = 0
   protocol    = "-1"
   cidr_blocks = ["0.0.0.0/0"]
 }

  tags = {
    Name        = local.security_group_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
  }
}

resource "aws_lb" "ecs_alb" {
  name               = local.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.security_group.id]
  subnets            = [aws_subnet.subnet.id, aws_subnet.subnet2.id]

  tags = {
    Name        = local.alb_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    Role        = var.role_lb
    Purpose     = var.purpose_lb
  }

  depends_on = [ aws_internet_gateway.internet_gateway ]
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = local.alb_lb_target_group_name
  port        = var.client_port
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = aws_vpc.main.id

  health_check {
    path = "/"
  }

  tags = {
    Name        = local.alb_lb_target_group_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    Role        = var.role_tg
    Purpose     = var.purpose_tg
  }
}

resource "aws_lb_listener" "ecs_alb_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = var.client_port
  protocol          = "HTTP"

  default_action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
  tags = {
    Name        = local.alb_listener_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    Role        = var.role_listener
    Purpose     = var.purpose_listener
  }
}

resource "aws_lb_listener_rule" "redirect_to_https_for_subdomain" {
  listener_arn = aws_lb_listener.ecs_alb_listener.arn
  priority     = 1

  condition {
    host_header {
      values = [var.subdomain]
    }
  }

  action {
    type = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "ecs_alb_https_listener" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 443
  protocol          = "HTTPS"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
  tags = {
    Name        = local.alb_listener_name
    Environment = var.environment
    Project     = var.project_name
    Owner       = var.owner
    Role        = var.role_listener
    Purpose     = var.purpose_listener
  }
}

resource "aws_lb_listener_rule" "redirect_to_target_group_for_subdomain" {
  listener_arn = aws_lb_listener.ecs_alb_https_listener.arn
  priority     = 1
  condition {
    host_header {
      values = [var.subdomain]
    }
  }
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }
}
