import { Injectable } from '@angular/core';
import { getPredictionFn } from 'tensorflow-dnd-classifier';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  public matches: any[] = [
  ];
  predict: Function;
  constructor() { }

  async aiMatch() {
    console.log('Matches are: ', JSON.stringify(this.matches));
    this.predict = await getPredictionFn(this.matches.length ? this.matches : undefined);
    return this.predict;
  }
}
