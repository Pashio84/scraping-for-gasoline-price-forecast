import { SheetService } from './sheet.service';

declare var global: any;

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};

global.updateSheet = (): void => {
  let regularGasolinePrice: number;
  let highOctaneGasolinePrice: number;
  let wtiCrudeOilPrice: number;
  let brentCrudeOilPrice: number;
  let temperature: number;
  let precipitation: number;

  let document = UrlFetchApp.fetch('https://gogo.gs/12').getContentText('UTF-8');
  let regularGasolineDom = document.match(
    /<label>レギュラー<\/label>\s*<div class="price">([0-9\.])*<\/div>/
  )[0];
  regularGasolinePrice = Number(regularGasolineDom.replace(/<\/?[a-z]*( [a-z\=\"]*)?>[ア-ンー]*(\s *)?/g, ''));
  Logger.log(`Regular = ${regularGasolinePrice}`);

  let highOctaneGasolineDom = document.match(
    /<label>ハイオク<\/label>\s*<div class="price">([0-9\.])*<\/div>/
  )[0];
  highOctaneGasolinePrice = Number(highOctaneGasolineDom.replace(/<\/?[a-z]*( [a-z\=\"]*)?>[ア-ンー]*(\s *)?/g, ''));
  Logger.log(`High octane = ${highOctaneGasolinePrice}`);
};
