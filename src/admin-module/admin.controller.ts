import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export default class AdminController {
  constructor(private readonly adminService: AdminService) {}
}
