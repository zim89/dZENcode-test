import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { extname } from 'path';

const multerOptions = {
  fileFilter: (req: any, file: any, cb: any) => {
    console.log(file);
    if (file.mimetype.match(/\/(jpeg|plain|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Unsupported file type ${extname(file.originalname)}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './temp');
    },
    filename: (req, file, cb) => {
      const fileExt = file?.mimetype?.split('/')[1];
      const fileGen = `${Date.now()}.${fileExt}`;
      cb(null, fileGen);
    },
  }),
};

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseInterceptors(FileInterceptor('file', multerOptions))
  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @UploadedFile()
    file: Express.Multer.File,
    @Body()
    dto: CreateCommentDto,
  ) {
    return this.commentService.create(file, dto);
  }

  @Get()
  async findAll() {
    return this.commentService.findAll();
  }
}
