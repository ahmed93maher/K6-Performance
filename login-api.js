import http from 'k6/http';
import { check } from 'k6';


export default function () {
    const loginURL = 'https://test.kwentra.com/account/login/';
    const PutResURL = 'https://test.kwentra.com/api/reservation/individualreservation/v2/1341/?tenant_id=240'
    const getResURL = 'https://test.kwentra.com/api/reservation/individualreservation/v2/1341/?include[]=market.code&include[]=market.description&include[]=source.code&include[]=source.description&include[]=name.first_name&include[]=name.last_name&include[]=name.name&include[]=channel.name&include[]=block.code&include[]=country.name&include[]=booker.name&include[]=other_names.name&include[]=other_names.nationality&include[]=other_names.telephone&include[]=other_names.mobile&include[]=name.mobile&include[]=name.nationality&include[]=other_names.email&include[]=guest_flag.code&include[]=guest_flag.description&include[]=language.code&include[]=language.name&include[]=state.name&include[]=company.name&include[]=room_nights.manual_rate&include[]=room_nights.number_of_children&include[]=room_nights.number_of_adults&include[]=room_nights.rate_amount&include[]=room_nights.currency.code&include[]=room_nights.board_type.code&include[]=room_nights.board_type.description&include[]=room_nights.room_type.room_type&include[]=room_nights.actual_room_type.room_type&include[]=room_nights.room_number&include[]=room_nights.children&include[]=room_nights.daily_charges_posted&include[]=group_reservation.name&include[]=group_reservation.confirmation_number&include[]=name.telephone&include[]=name.email&include[]=room_nights.rate.code&include[]=order.payment_code&include[]=name.guest_preferences&include[]=other_names.guest_preferences&include[]=notes.updated_by.username&include[]=notes.created_by.username&include[]=do_not_move&include[]=room_nights.parent_room_type.room_type&include[]=room_nights.discount_amount&include[]=room_nights.discount_percentage&include[]=room_nights.parent_room_category&tenant_id=240'
    const jar = http.cookieJar();
    let loginReq ;
    let getResReq;
    let PutResReq;
    
    const loginPayload = {
      'csrfmiddlewaretoken': 'Cj4TFMQ8TGO3dPhEBU4e6u7x5ZFo3O3X2OgIOhaLotC9xryA6VqTusoAkEYBh3a6',
      'login_view-current_step': 'auth',
      'auth-username': 'admin',
      'auth-password': 'Adm1n1234'
    };
  
    const loginParams = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'x-requested-with': 'XMLHttpRequest',
        'referer':'https://test.kwentra.com/account/login/?next=/',
        'cookie':'csrftoken=Cj4TFMQ8TGO3dPhEBU4e6u7x5ZFo3O3X2OgIOhaLotC9xryA6VqTusoAkEYBh3a6'
      },
    };
  
    loginReq = http.post(loginURL, loginPayload, loginParams);
    const myCookies = jar.cookiesForURL(loginURL);

    check(loginReq, {
        'status is 200': (r) => r.status === 200,
        // 'cookie exist': (m) => m.cookies.json().user_id === 1,
      });

    const resParam = {
        headers: {
            'flutter.refresh_token':myCookies['flutter.refresh_token'],
            'csrftoken': myCookies['csrftoken'],
            'sessionid':myCookies['sessionid'],
            'user_id':myCookies['user_id'],
        },
    }

    getResReq = http.get(getResURL,resParam);
    console.log('Get Body',JSON.stringify(getResReq.body['reservation']))

    check(getResReq, {
        'statuiuuuuus': (r) => r.status === 200,
        'reservation ID': (r) => r.json().reservation.id === 1341,
      });

      const PutReqParam = {
        headers: {
            'flutter.refresh_token':myCookies['flutter.refresh_token'],
            'x-csrftoken': myCookies['csrftoken'],
            'sessionid':myCookies['sessionid'],
            'user_id':myCookies['user_id'],
            'referer': 'https://test.kwentra.com/frontoffice/',
            'accept':'application/json, text/plain, */*',
        },
    }
    const sentBody = getResReq.body['reservation'];

    PutResReq = http.put(PutResURL,sentBody,PutReqParam)

    check(PutResReq, {
        'put status': (r) => r.status === 200,
        'put reservation ID': (r) => r.json().id === 1341,
      });

      console.log('PUT Status',PutResReq.status)
      console.log('PUT Body', PutResReq.body)
      
  }