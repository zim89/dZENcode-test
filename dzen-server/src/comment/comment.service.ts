import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: TreeRepository<Comment>,
  ) {}

  async create(dto: CreateCommentDto) {
    const comment = this.commentRepository.create(dto);

    if (dto.parent_id) {
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
