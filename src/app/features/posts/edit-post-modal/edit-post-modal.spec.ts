import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { vi } from 'vitest';

import { EditPostModal } from './edit-post-modal';
import { UserPosts } from '@/shared/services/user-posts/user-posts';
import { PostStore } from '@/shared/store/posts/post.store';
import { of } from 'rxjs';

describe('EditPostModal', () => {
  let component: EditPostModal;
  let fixture: ComponentFixture<EditPostModal>;
  let componentRef: ComponentRef<EditPostModal>;

  // 1. Criamos mocks simples para os serviços injetados
  const mockUserPosts = {
    updatePost: vi.fn().mockReturnValue(of({ id: 1, title: 'Atualizado', body: 'Conteúdo' })),
  };

  const mockPostStore = {
    updatePostInStore: vi.fn(),
  };

  // Dado simulado para satisfazer o input.required
  const mockPostData = { id: 1, title: 'Título Teste', body: 'Conteúdo Teste' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPostModal],
      providers: [
        // 2. Fornecemos os mocks substituindo os serviços reais
        { provide: UserPosts, useValue: mockUserPosts },
        { provide: PostStore, useValue: mockPostStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPostModal);
    component = fixture.componentInstance;

    // Pegamos a referência do componente para poder definir o input.required
    componentRef = fixture.componentRef;

    // 3. DEFINIR O INPUT OBRIGATÓRIO ANTES DO PRIMEIRO DETECTCHANGES
    componentRef.setInput('post', mockPostData);

    // Agora sim forçamos o ciclo de vida inicial de forma segura
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
