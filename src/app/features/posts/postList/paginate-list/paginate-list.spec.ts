import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { PaginateList } from './paginate-list';
import { PostStore } from '@/shared/store/posts/post.store';
import { UserPosts } from '@/shared/services/user-posts/user-posts';

describe('PaginateList', () => {
  let component: PaginateList;
  let componentRef: ComponentRef<PaginateList>;
  let fixture: ComponentFixture<PaginateList>;

  const mockPostStore = {};
  const mockUserPosts = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginateList],
      providers: [
        { provide: PostStore, useValue: mockPostStore },
        { provide: UserPosts, useValue: mockUserPosts },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginateList);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
  });
  
  it('should create PaginateList', () => {
    expect(component).toBeTruthy();
  });

  describe('inputs and signals computed', () => {
    it('use default values for itemsPerPage(10) and currentPage(0)', () => {
      componentRef.setInput('totalItems', 50);
      fixture.detectChanges();

      expect(component.totalItems()).toBe(50);
      expect(component.itemsPerPage()).toBe(10);
      expect(component.currentPage()).toBe(0);
    });

    it('should calculate totalPages correctly', () => {
      // 25 itens com 10 por página = 3 páginas (Math.ceil)
      componentRef.setInput('totalItems', 25);
      componentRef.setInput('itemsPerPage', 10);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(3);
    });

    it('should calculate totalPages as 0 when totalItems is 0', () => {
      componentRef.setInput('totalItems', 0);
      componentRef.setInput('itemsPerPage', 10);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(0);
    });

    it('should generate the countList array with the correct size based on totalPages', () => {
      componentRef.setInput('totalItems', 30);
      componentRef.setInput('itemsPerPage', 10);
      fixture.detectChanges();

      expect(component.countList()).toEqual([0, 1, 2]);
    });

    it('It must dynamically recompute totalPages and countList when the inputs change', () => {
      componentRef.setInput('totalItems', 10);
      componentRef.setInput('itemsPerPage', 5);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(2);
      expect(component.countList()).toEqual([0, 1]);

      componentRef.setInput('totalItems', 20);
      fixture.detectChanges();

      expect(component.totalPages()).toBe(4);
      expect(component.countList()).toEqual([0, 1, 2, 3]);
    });
  });

  describe('onSetPage Method', () => {
    it('must emit pageChange when the new page is different from the currentPage', () => {
      componentRef.setInput('totalItems', 50);
      componentRef.setInput('currentPage', 0);
      fixture.detectChanges();

      const pageChangeSpy = vi.fn();
      component.pageChange.subscribe(pageChangeSpy);
      component.onSetPage(2);

      expect(pageChangeSpy).toHaveBeenCalledTimes(1);
      expect(pageChangeSpy).toHaveBeenCalledWith(2);
    });
    
    it('must NOT   emit pageChange when the new page is different from the currentPage', () => {
      componentRef.setInput('totalItems', 50);
      componentRef.setInput('currentPage', 1);
      fixture.detectChanges();

      const pageChangeSpy = vi.fn();
      component.pageChange.subscribe(pageChangeSpy);
      component.onSetPage(1);

      expect(pageChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Dependency Injection', () => { 
    it('should correctly inject PostStore and UserPosts', () => {
      expect(component.store).toBeDefined();
      expect(component.postService).toBeDefined();
      expect(component.store).toBe(mockPostStore);
      expect(component.postService).toBe(mockUserPosts);
    });
  });
});
