import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule],
    exports: [MatButtonModule, MatToolbarModule, MatFormFieldModule, MatInputModule],
})

export class MaterialModule {}
