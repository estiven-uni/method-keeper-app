import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioMetodoComponent } from './formulario-metodo.component';

describe('FormularioMetodoComponent', () => {
  let component: FormularioMetodoComponent;
  let fixture: ComponentFixture<FormularioMetodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioMetodoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioMetodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
