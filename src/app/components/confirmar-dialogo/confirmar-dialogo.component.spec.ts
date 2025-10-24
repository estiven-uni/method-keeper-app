import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarDialogoComponent } from './confirmar-dialogo.component';

describe('ConfirmarDialogoComponent', () => {
  let component: ConfirmarDialogoComponent;
  let fixture: ComponentFixture<ConfirmarDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarDialogoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmarDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
