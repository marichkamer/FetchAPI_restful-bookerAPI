import assert from 'assert';

(async () => {
  try {

    const createToken = await fetch("https://restful-booker.herokuapp.com/auth", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'password123'
      })
    });

    assert.strictEqual(createToken.status, 200);
    const token = (await createToken.json()).token;

  
    const createBooking = await fetch("https://restful-booker.herokuapp.com/booking", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstname: "Jim",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01"
        },
        additionalneeds: "Breakfast"
      })
    });

    assert.strictEqual(createBooking.status, 200);
    
    assert.ok(
      createBooking.headers.get('content-type').includes('application/json')
    );

    const bookingId = (await createBooking.json()).bookingid;

    
    const getBooking = await fetch(`https://restful-booker.herokuapp.com/booking/${bookingId}`);
    assert.strictEqual(getBooking.status, 200);

    const getData = await getBooking.json();
    assert.strictEqual(getData.firstname, 'Jim');

  
    const updateBooking = await fetch(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        firstname: "Milan",
        lastname: "Brown",
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: "2018-01-01",
          checkout: "2019-01-01"
        },
        additionalneeds: "Breakfast"
      })
    });

    assert.strictEqual(updateBooking.status, 200);

    const updateData = await updateBooking.json();
    assert.strictEqual(updateData.firstname, 'Milan');

    
    const deleteBooking = await fetch(`https://restful-booker.herokuapp.com/booking/${bookingId}`, {
      method: 'DELETE',
      headers: {
        'Cookie': `token=${token}`
      }
    });

    assert.strictEqual(deleteBooking.status, 201);

    console.log('ALL TESTS PASSED');

  } catch (err) {
    console.error('FAILED:', err);
  }
})();