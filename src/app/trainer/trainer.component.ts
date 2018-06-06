import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AiService } from '../ai.service';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.styl']
})
export class TrainerComponent implements OnInit {
  statMap = {};
  stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
  classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin',
    'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer', 'Mystic', 'Farmer',];
  predict: Function;
  showPredict = false;

  constructor(public aiService: AiService) { }

  ngOnInit() {
    this.randomizeStats();
  }

  handleClick(chosenClass) {
    this.aiService.matches.push([this.statMap, [chosenClass.toLowerCase()]]);
    this.randomizeStats();
    Swal(`${chosenClass} chosen`, '', 'success');
  }

  randomizeStats() {
    this.stats.forEach(stat => {
      this.statMap[stat] = this.getRandomInt(3, 21);
    });
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
  }

  async getPredictionFn() {
    this.predict = await this.aiService.aiMatch();
    this.randomizeStats();
    this.showPredict = true;
  }

  async getPrediction() {
    const results = await this.predict(this.statMap);
    console.log(results);
    const cleanedResults = results.slice(0, 3)
      .map(x => [`${x[0][0].toUpperCase()}${x[0].slice(1)}`, x[1].toFixed(3) * 100]);
    const body = `
      ${Object.entries(this.statMap).map(([stat, val]) => `${stat}: ${val}`).join('\n')}
      ${(cleanedResults as any[][]).map(([className, percent]) => `${className}: ${percent}%`)}
    `;
    Swal('Prediction', body, 'success');
  }
}
