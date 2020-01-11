import { SheetService } from './sheet.service';
import { getDateFormat } from './util';

declare var global: any;

global.getInnerNumber = (dom: string): number => {
  return Number(
    dom.replace(
      /\ *<\/?[\p{Han}\p{Hiragana}\p{Katakana}a-zA-Z0-9.\/=;:" _-]*>[\p{Han}\p{Hiragana}\p{Katakana}ー]*[\s ]*?/g,
      ''
    )
  );
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
  const now: Date = new Date();
  const oneHourAgo: Date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours() - 1,
    0
  );

  let regularGasolinePrice: number;
  let highOctaneGasolinePrice: number;
  let wtiCrudeOilPrice: number;
  let brentCrudeOilPrice: number;
  let exchange: number;
  let temperature: number;
  let precipitation: number;

  if (SheetService.isExsistsByDate(getDateFormat(oneHourAgo))) {
    console.log(`Row data for "${getDateFormat(oneHourAgo)}" is exists.`);
  } else {
    let document = global.fetchFromPhantomJs('https://e-nenpi.com/gs/price_graph');
    let regularGasolineDom = document.match(
      /<p class="price last-child" id="real_time_regular">(\s*<span.*>[0-9.]<\/span>)*/
    )[0];
    regularGasolinePrice = global.getInnerNumber(regularGasolineDom);
    console.log(`Regular = ${regularGasolinePrice}`);

    let highOctaneGasolineDom = document.match(
      /<p class="price last-child" id="real_time_highoct">(\s*<span.*>[0-9.]<\/span>)*/
    )[0];
    highOctaneGasolinePrice = global.getInnerNumber(highOctaneGasolineDom);
    console.log(`High octane = ${highOctaneGasolinePrice}`);

    document = global.fetchFromPhantomJs('https://nikkei225jp.com/oil/');
    let wtiCrudeOilDom = document.match(
      /<div id="V921" class="val2 valN">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    wtiCrudeOilPrice = global.getInnerNumber(wtiCrudeOilDom);
    console.log(`WTI crude oil = ${wtiCrudeOilPrice}`);

    let brentCrudeOilDom = document.match(
      /<div id="V922" class="val2 valN">[\s ]*<p>[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    brentCrudeOilPrice = global.getInnerNumber(brentCrudeOilDom);
    console.log(`Brent crude oil = ${brentCrudeOilPrice}`);

    let exchangeDom = document.match(
      /<div id="V511" class="val2">[\s ]*<p class="smy">[0-9.]*<\/p>[\s ]*<\/div>/
    )[0];
    exchange = global.getInnerNumber(exchangeDom);
    console.log(`Exchange = ${exchange}`);

    document = UrlFetchApp.fetch(
      `https://www.data.jma.go.jp/obd/stats/etrn/view/hourly_s1.php?prec_no=45&block_no=47682&year=${oneHourAgo.getFullYear()}&month=${oneHourAgo.getMonth() +
        1}&day=${oneHourAgo.getDate()}&view=`
    ).getContentText('UTF-8');
    let weatherDom = document.match(
      new RegExp(
        `<td style="white-space:nowrap">${oneHourAgo.getHours()}<\/td>(\s*<td class="data_0_0">.*)*`
      )
    )[0];
    let splitedWeatherDom = weatherDom.replace(/--/, '0').split('</td>');
    temperature = global.getInnerNumber(splitedWeatherDom[4]);
    precipitation = global.getInnerNumber(splitedWeatherDom[3]);
    console.log(`Temperature = ${temperature}`);
    console.log(`Precipitation = ${precipitation}`);

    SheetService.insertValues([
      getDateFormat(oneHourAgo),
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
