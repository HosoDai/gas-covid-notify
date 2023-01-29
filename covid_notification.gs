function covidNotification(e) {
  // 表示できるカレンダーオブジェクト取得
  const calendars = CalendarApp.getAllCalendars();

  //formsからの回答を変数に代入
  var itemResponses = e.response.getItemResponses();
  var itemName = itemResponses[0].getResponse();
  var itemResponse = itemResponses[1].getResponse();

  // formsから入力された陽性判定日を取得
  const format_today = Utilities.formatDate(new Date(itemResponse), "JST", "yyyy-MM-dd");
  const today = new Date(format_today);

  //Googleカレンダーから取得するイベントの終了日(2日前)を設定する
  let endDate = new Date(format_today);
  endDate.setDate(today.getDate() - 2);

  //メールテンプレート
  const subject = "【新型コロナウイルス濃厚接触者通知】";
  let options = {
        name: itemName
      };

  for(var tmp_c in calendars) {
    let calendar = calendars[tmp_c];

    // 指定日（当日）の予定オブジェクトの配列を取得
    const events = calendar.getEvents(endDate, today);
    
    // 予定が1件以上ある場合
    if(events) {
      for (var i in events) {
        var event = events[i];

        var body = `あなたは  ${itemName}  様の濃厚接触者に該当する可能性があります．\n`
           + "\n"
           + `■  ${itemName}  様の陽性判定日は  ${format_today}  です．\n`
           + "\n"
           + "■ 該当するイベント\n"
           + `${event.getTitle()}\n`
           + "\n\n"
           + "from Google Calendar";

        //予定のオーナーであるかどうかを真偽値で決める
        var boolean = event.isOwnedByMe();
        console.log(boolean);

        //予定のオーナーであった場合
        if(boolean == true) {
          var guests = event.getGuestList();
          for (var j in guests) {
            var recepient = guests[j].getEmail();
            GmailApp.sendEmail(recepient, subject, body, options);
            console.log(guests[j].getEmail());
          }
        }
        //予定のオーナーでない場合
        else {
          var guests = event.getGuestList();
          var creators = event.getCreators();
          for (var j in guests) {
            console.log(guests[j].getEmail());
            var recepient = guests[j].getEmail();
            GmailApp.sendEmail(recepient, subject, body, options);
          }
          var recepient_creators = creators[0];
          GmailApp.sendEmail(recepient_creators, subject, body, options);
          console.log(creators[0]);
        }
      }
    }
    //予定が無い場合
    else {
      console.log("No events found.");
    }
  }
}
