import { Component, inject, signal } from '@angular/core';
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

   onEditModal(post: Posts) { 
    this.selectedPostForEdit.set(post);
  };

  onCloseModal() { 
    this.selectedPostForEdit.set(null);
  };

  async onRemovePost(id: number | undefined) {
    if (!id) return;

    if (confirm("Quer mesmo excluir esse post?")) {
      try { 
        await lastValueFrom(this.postService.deletePost(id));
        this.store.removePost(id);
        console.log(`Post #${id} removido com sucesso.`);
      } catch (error) {
        console.error('Erro ao deletar post:', error);
      }
    }
  }

  ngOnInit() {
    this.store.loadPosts();
    this.store.posts();
  }
}
