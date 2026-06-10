import { Component } from '@angular/core';
import { PostList } from '@/features/posts/post-list/post-list';

@Component({
  selector: 'app-home',
  imports: [PostList],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
