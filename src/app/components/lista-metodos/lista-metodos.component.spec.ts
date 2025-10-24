import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaMetodosComponent } from './lista-metodos.component';

describe('ListaMetodosComponent', () => {
  let component: ListaMetodosComponent;
  let fixture: ComponentFixture<ListaMetodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaMetodosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaMetodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
