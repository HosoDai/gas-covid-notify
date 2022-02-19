function covidNotification(e) {
  // 対象のカレンダーID
  const calendarId = 'fu8k8b2mcto7ji62lk8fo1aaes@group.calendar.google.com';
  // カレンダーオブジェクト取得
  const calendar = CalendarApp.getCalendarById(calendarId);

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

  // 指定日（当日）の予定オブジェクトの配列を取得
  const events = calendar.getEvents(endDate, today);

  // // 予定のタイトルを取得
  // let title = events[i].getTitle();
  // // 予定の開始時刻・終了時刻を取得
  // let startHour = events[i].getStartTime().getHours();
  // let startMinute = events[i].getStartTime().getMinutes();
  // let endHour = events[i].getEndTime().getHours();
  // let endMinute = events[i].getEndTime().getMinutes();


  // 予定が1件以上ある場合
  if(events) {
    for (var i in events) {
      var event = events[i];

      //予定のオーナーであるかどうかを真偽値で決める
      var boolean = event.isOwnedByMe();
      console.log(boolean);

      //予定のオーナーであった場合
      if(boolean == true) {
        var guests = event.getGuestList();
        for (var j in guests) {
          var recepient = guests[j].getEmail();
          sendEmail(recepient, itemName, events[i].getTitle());
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
          sendEmail(recepient, itemName, events[i].getTitle());
        }
        var recepient_creators = creators[0];
        sendEmail(recepient_creators, itemName, events[i].getTitle());
        console.log(creators[0]);
      }
    }
  }
  //予定が無い場合
  else {
    console.log("No events found.");
  }
}

function sendEmail(recepient, itemName, event) {

  //メールテンプレート
  const subject = "【新型コロナウイルス濃厚接触者通知】";
  var body = `あなたは  ${itemName}  様の濃厚接触者に該当する可能性があります．\n`
           + "■ 該当するイベント\n"
           + `${event}\n`
           + "\n\n"
           + "from Google Calendar";

  let options = {
    name: itemName
  };

  GmailApp.sendEmail(recepient, subject, body, options);
}
