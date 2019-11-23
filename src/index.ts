import { SheetService } from './sheet.service';

declare var global: any;

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};

global.updateSheet = (): void => {
  const apikey: string = '';
  let yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

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

  document = UrlFetchApp.fetch(
    `https://www.data.jma.go.jp/obd/stats/etrn/view/daily_s1.php?prec_no=45&block_no=47682&year=${yesterday.getFullYear()}&month=${yesterday.getMonth() +
      1}&day=&view=`
  ).getContentText('UTF-8');
  let weatherDom = document.match(
    new RegExp(
      `<td style="white-space:nowrap"><div class="a_print"><a href=".*">${yesterday.getDate()}</a></div></td><td class="data_0_0"( style="text-align:.*")?>.*</td>`
    )
  )[0];
  let splitedWeatherDom = weatherDom.split('</td>');
  temperature = getInnerNumber(splitedWeatherDom[3]);
  precipitation = getInnerNumber(splitedWeatherDom[6]);
  Logger.log(`Temperature = ${temperature}`);
  Logger.log(`Precipitation = ${precipitation}`);

  function getInnerNumber(dom: string): number {
    return Number(dom.replace(/\ *<\/?[a-zA-Z0-9=" _]*>[ア-ンー]*[\s ]*?/g, ''));
  }

  function fetchFromPhantomJs(target: string): string {
    var url = `https://phantomjscloud.com/api/browser/v2/${apikey}/?request=%7Burl:%22${target}%22,renderType:%22HTML%22,outputAsJson:true%7D`;
    var response = UrlFetchApp.fetch(url).getContentText();
    var json = JSON.parse(response);
    return json['content']['data'].toString();
  }
};
