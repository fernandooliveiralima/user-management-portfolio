import { Component, computed, effect, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import { EditPostModal } from '@/features/posts/edit-post-modal/edit-post-modal';
import { Posts } from '@/shared/types/posts/posts.model';

@Component({
  selector: 'app-post-list',
  imports: [EditPostModal],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss',
})
export class PostList {
  readonly store = inject(PostStore);
  postService = inject(UserPosts);

  selectedPostForEdit = signal<Posts | null>(null);
  postsPerPage = signal(10);
  currentPage = signal(0);
  
  totalPages = computed<number>(() => Math.ceil(this.store.posts().length / this.postsPerPage()));
  countList = computed<number[]>(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  startPostRange = computed(() => this.currentPage() * this.postsPerPage());
  finalPostRange = computed(() => this.startPostRange() + this.postsPerPage());
  paginatedPosts = computed(() => this.store.posts().slice(this.startPostRange(), this.finalPostRange()));

  onCurrentPage(id: number): boolean {
    const isCurrentPage = this.currentPage();
    return isCurrentPage === id;
  }

  onSetPage(pageIndex: number) { 
    this.currentPage.set(pageIndex);
  };

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
