import { SheetService } from './sheet.service';
import { getDayFormat } from './util';

declare var global: any;

global.getInnerNumber = (dom: string): number => {
  return Number(dom.replace(/\ *<\/?[a-zA-Z0-9=" _]*>[ア-ンー]*[\s ]*?/g, ''));
};

global.fetchFromPhantomJs = (target: string): string => {
  const apikey: string = '';
  var url = `https://phantomjscloud.com/api/browser/v2/${apikey}/?request=%7Burl:%22${target}%22,renderType:%22HTML%22,outputAsJson:true%7D`;
  var response = UrlFetchApp.fetch(url).getContentText();
  var json = JSON.parse(response);
  return json['content']['data'].toString();
};

global.createNewFile = (): void => {
  const ss = SheetService.createInitialFile('New file');
  ss.getRange('A2').setValue('Happy gas!');
};

global.updateSheet = (): void => {
  let yesterday: Date = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let regularGasolinePrice: number;
  let highOctaneGasolinePrice: number;
  let wtiCrudeOilPrice: number;
  let brentCrudeOilPrice: number;
  let exchange: number;
  let temperature: number;
  let precipitation: number;

  if (SheetService.isExsistsByDate(getDayFormat(yesterday))) {
    console.log(`Row data for "${getDayFormat(yesterday)}" is exists.`);
  } else {
    let document = UrlFetchApp.fetch('https://gogo.gs/12').getContentText('UTF-8');
    let regularGasolineDom = document.match(
      /<label>レギュラー<\/label>\s*<div class="price">([0-9\.])*<\/div>/
    )[0];
    regularGasolinePrice = global.getInnerNumber(regularGasolineDom);
    console.log(`Regular = ${regularGasolinePrice}`);

    let highOctaneGasolineDom = document.match(
      /<label>ハイオク<\/label>\s*<div class="price">([0-9\.])*<\/div>/
    )[0];
    highOctaneGasolinePrice = global.getInnerNumber(highOctaneGasolineDom);
    console.log(`High octane = ${highOctaneGasolinePrice}`);

    document = global.fetchFromPhantomJs('https://nikkei225jp.com/oil/');
    let wtiCrudeOilDom = document.match(
      /<div class="val2 valN" id="V921">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    wtiCrudeOilPrice = global.getInnerNumber(wtiCrudeOilDom);
    console.log(`WTI crude oil = ${wtiCrudeOilPrice}`);

    let brentCrudeOilDom = document.match(
      /<div class="val2 valN" id="V922">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    brentCrudeOilPrice = global.getInnerNumber(brentCrudeOilDom);
    console.log(`Brent crude oil = ${brentCrudeOilPrice}`);

    let exchangeDom = document.match(
      /<div class="val2" id="V511">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    exchange = global.getInnerNumber(exchangeDom);
    console.log(`Exchange = ${exchange}`);

    document = UrlFetchApp.fetch(
      `https://www.data.jma.go.jp/obd/stats/etrn/view/daily_s1.php?prec_no=45&block_no=47682&year=${yesterday.getFullYear()}&month=${yesterday.getMonth() +
        1}&day=&view=`
    ).getContentText('UTF-8');
    let weatherDom = document.match(
      new RegExp(
        `<td style="white-space:nowrap"><div class="a_print"><a href=".*">${yesterday.getDate()}</a></div></td><td class="data_0_0"( style="text-align:.*")?>.*</td>`
      )
    )[0];
    let splitedWeatherDom = weatherDom.replace(/--/, '0').split('</td>');
    temperature = global.getInnerNumber(splitedWeatherDom[6]);
    precipitation = global.getInnerNumber(splitedWeatherDom[3]);
    console.log(`Temperature = ${temperature}`);
    console.log(`Precipitation = ${precipitation}`);

    SheetService.insertValues([
      getDayFormat(yesterday),
      regularGasolinePrice,
      highOctaneGasolinePrice,
      wtiCrudeOilPrice,
      brentCrudeOilPrice,
      exchange,
      temperature,
      precipitation
    ]);

    SheetService.sortDataByDate();
  }
};
