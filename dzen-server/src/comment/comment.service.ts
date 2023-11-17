import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import * as path from 'path';
import * as sharp from 'sharp';
import * as fs from 'fs/promises';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: TreeRepository<Comment>,
  ) {}

  async create(file: Express.Multer.File, dto: CreateCommentDto) {
    console.log(file);

    const filePathTemp = path.resolve('temp', file?.filename ?? '');
    const filePath = path.resolve('uploads', file?.filename ?? '');

    if (file && file.mimetype.includes('image')) {
      await sharp(filePathTemp)
        .resize(320, 240, {
          fit: 'contain',
        })
        .toFile(filePath);

      await fs.unlink(filePathTemp);
    }

    if (file && file.mimetype.includes('text')) {
      await fs.rename(filePathTemp, filePath);
    }

    const comment = this.commentRepository.create({
      ...dto,
      file: file?.filename ?? '',
    });

    if (dto?.parent_id) {
      const parent = await this.commentRepository.findOne({
        where: { id: dto.parent_id },
      });
      comment.parent = parent;
    }
    return this.commentRepository.save(comment);
  }

  async findAll() {
    const trees = await this.commentRepository.findTrees();
    return trees;
  }
}
