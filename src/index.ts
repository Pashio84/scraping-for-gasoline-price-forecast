import { SheetService } from './sheet.service';

declare var global: any;

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};

global.updateSheet = (): void => {
  const apikey = '';
  let regularGasolinePrice: number;
  let highOctaneGasolinePrice: number;
  let wtiCrudeOilPrice: number;
  let brentCrudeOilPrice: number;
  let exchange: number;
  let temperature: number;
  let precipitation: number;

  let document = UrlFetchApp.fetch('https://gogo.gs/12').getContentText('UTF-8');
  let regularGasolineDom = document.match(
    /<label>レギュラー<\/label>\s*<div class="price">([0-9\.])*<\/div>/
  )[0];
  regularGasolinePrice = getInnerNumber(regularGasolineDom);
  Logger.log(`Regular = ${regularGasolinePrice}`);

  let highOctaneGasolineDom = document.match(
    /<label>ハイオク<\/label>\s*<div class="price">([0-9\.])*<\/div>/
  )[0];
  highOctaneGasolinePrice = getInnerNumber(highOctaneGasolineDom);
  Logger.log(`High octane = ${highOctaneGasolinePrice}`);

  document = fetchFromPhantomJs('https://nikkei225jp.com/oil/');
  let wtiCrudeOilDom = document.match(
    /<div id="V921" class="val2 valN">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
  )[0];
  wtiCrudeOilPrice = getInnerNumber(wtiCrudeOilDom);
  Logger.log(`WTI crude oil = ${wtiCrudeOilPrice}`);

  let brentCrudeOilDom = document.match(
    /<div id="V922" class="val2 valN">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
  )[0];
  brentCrudeOilPrice = getInnerNumber(brentCrudeOilDom);
  Logger.log(`Brent crude oil = ${brentCrudeOilPrice}`);

  let exchangeDom = document.match(
    /<div id="V511" class="val2">[\s ]*<p class="smy">[0-9.]*<\/p>[\s ]*<\/div>/
  )[0];
  exchange = getInnerNumber(exchangeDom);
  Logger.log(`Exchange = ${exchange}`);

  function getInnerNumber(dom: string): number {
    return Number(dom.replace(/\ *<\/?[a-zA-Z0-9\=\"\ ]*>[ア-ンー]*[\s\ ]*?/g, ''));
  }

  function fetchFromPhantomJs(target: string): string {
    var url = `https://phantomjscloud.com/api/browser/v2/${apikey}/?request=%7Burl:%22${target}%22,renderType:%22HTML%22,outputAsJson:true%7D`;
    var response = UrlFetchApp.fetch(url).getContentText();
    var json = JSON.parse(response);
    return json['content']['data'].toString();
  }
};
