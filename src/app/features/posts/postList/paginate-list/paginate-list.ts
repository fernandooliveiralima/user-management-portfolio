import { Component, computed, inject, output, input } from '@angular/core';

import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';

@Component({
  selector: 'app-paginate-list',
  imports: [],
  templateUrl: './paginate-list.html',
  styleUrl: './paginate-list.scss',
})
export class PaginateList {
  readonly store = inject(PostStore);
  postService = inject(UserPosts);

  totalItems = input.required<number>();
  itemsPerPage = input<number>(10);
  currentPage = input<number>(0);

  pageChange = output<number>();

  totalPages = computed<number>(() => Math.ceil(this.totalItems() / this.itemsPerPage()));
  countList = computed<number[]>(() => Array.from({ length: this.totalPages() }, (_, i) => i));

  onSetPage(pageIndex: number): void {
    if (pageIndex !== this.currentPage()) {
      this.pageChange.emit(pageIndex);
    }
  }
}
