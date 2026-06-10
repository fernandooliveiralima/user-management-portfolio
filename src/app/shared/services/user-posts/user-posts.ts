import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import type { Posts } from '@/shared/types/posts/posts.model';

@Injectable({
  providedIn: 'root',
})
export class UserPosts {
  private url = `${environment.apiUrl}/posts`;
  httpClient = inject(HttpClient);

  getPosts() {
    return this.httpClient.get<Posts[]>(this.url);
  }

  createPost(post: Posts) {
    return this.httpClient.post<Posts>(this.url, post);
  }

  updatePost(id: number, post: Posts) {
    return this.httpClient.put<Posts>(`${this.url}/${id}`, post);
  }

  deletePost(id: number) { 
    return this.httpClient.delete<Posts[]>(`${this.url}/${id}`);
  };
}
