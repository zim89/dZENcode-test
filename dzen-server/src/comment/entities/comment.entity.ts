import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@Tree('materialized-path')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({
    type: 'varchar',
    length: 150,
    default: '',
  })
  homepage: string;

  @Column()
  captcha: string;

  @Column({})
  text: string;

  @Column({
    type: 'varchar',
    length: 150,
    default: '',
  })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @TreeChildren()
  children: Comment[];

  @TreeParent()
  parent: Comment;
}
