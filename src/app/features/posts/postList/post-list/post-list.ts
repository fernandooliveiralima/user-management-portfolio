import { Component, computed, effect, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import { EditPostModal } from '@/features/posts/edit-post-modal/edit-post-modal';
import type { Posts } from '@/shared/types/posts/posts.model';
import { PaginateList } from '@/features/posts/postList/paginate-list/paginate-list';

@Component({
  selector: 'app-post-list',
  imports: [EditPostModal, PaginateList],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList {
  readonly store = inject(PostStore);
  postService = inject(UserPosts);

  selectedPostForEdit = signal<Posts | null>(null);
  postsPerPage = signal(10);
  currentPage = signal(0);

  startPostRange = computed(() => this.currentPage() * this.postsPerPage());
  finalPostRange = computed(() => this.startPostRange() + this.postsPerPage());
  paginatedPosts = computed(() => this.store.posts().slice(this.startPostRange(), this.finalPostRange()));

  onSetPage(pageIndex: number) {
    this.currentPage.set(pageIndex);
  }

  onEditModal(post: Posts) {
    this.selectedPostForEdit.set(post);
  }

  onCloseModal() {
    this.selectedPostForEdit.set(null);
  }

  async onRemovePost(id: number | undefined) {
    if (!id) return;

    if (confirm('Quer mesmo excluir esse post?')) {
      try {
        await lastValueFrom(this.postService.deletePost(id));
        this.store.removePost(id);
        console.log(`Post #${id} removido com sucesso.`);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  }

  constructor() {
    effect(() => {
      this.store.loadPosts();
      this.store.posts();
    });
  }
}
