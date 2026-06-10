import { Component } from '@angular/core';
import { PostForm } from '@/features/posts/post-form/post-form';

@Component({
  selector: 'app-create-post',
  imports: [PostForm],
  templateUrl: './create-post.html',
  styleUrl: './create-post.scss',
})
export class CreatePost {}
