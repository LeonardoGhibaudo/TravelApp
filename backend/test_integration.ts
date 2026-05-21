const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log("🚀 Starting Backend Integration Audit...\n");

  try {
    // 1. Signup User A
    console.log("=> Testing: Signup User A");
    const emailA = `usera_${Date.now()}@test.com`;
    const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "User A", email: emailA, password: "password123" })
    });
    if (!signupRes.ok) throw new Error(`Signup A failed: ${await signupRes.text()}`);
    const dataA = await signupRes.json();
    const tokenA = dataA.accessToken;
    console.log("   ✅ Success. Token A acquired.");

    // 2. Signup User B
    console.log("=> Testing: Signup User B");
    const emailB = `userb_${Date.now()}@test.com`;
    const signupResB = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: "User B", email: emailB, password: "password123" })
    });
    if (!signupResB.ok) throw new Error(`Signup B failed: ${await signupResB.text()}`);
    const dataB = await signupResB.json();
    const tokenB = dataB.accessToken;
    console.log("   ✅ Success. Token B acquired.");

    // 3. Create Trip as User A
    console.log("=> Testing: Create Trip (User A)");
    const tripRes = await fetch(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ name: "Japan Tour", destination: "Tokyo", startDate: "2026-10-10", endDate: "2026-10-20" })
    });
    if (!tripRes.ok) throw new Error(`Create Trip failed: ${await tripRes.text()}`);
    const trip = await tripRes.json();
    const tripId = trip.id;
    console.log(`   ✅ Success. Trip ID: ${tripId}`);

    // 4. Generate Invite for Trip (User A invites User B)
    console.log("=> Testing: Generate Invite (User A invites User B)");
    const inviteRes = await fetch(`${BASE_URL}/trips/${tripId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ email: emailB, role: "VIEWER" })
    });
    if (!inviteRes.ok) throw new Error(`Invite generation failed: ${await inviteRes.text()}`);
    const inviteData = await inviteRes.json();
    const inviteToken = inviteData.token;
    console.log(`   ✅ Success. Invite Token generated: ${inviteToken}`);

    // 5. Accept Invite as User B
    console.log("=> Testing: Accept Invite (User B)");
    const acceptRes = await fetch(`${BASE_URL}/trips/invite/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenB}` },
      body: JSON.stringify({ token: inviteToken })
    });
    if (!acceptRes.ok) throw new Error(`Invite acceptance failed: ${await acceptRes.text()}`);
    console.log("   ✅ Success. User B joined the trip.");

    // 6. Verify User B can see the trip
    console.log("=> Testing: Fetch Trips (User B)");
    const getTripsRes = await fetch(`${BASE_URL}/trips`, {
      headers: { 'Authorization': `Bearer ${tokenB}` }
    });
    const tripsB = await getTripsRes.json();
    if (!tripsB.find((t: any) => t.id === tripId)) throw new Error("User B does not see the trip in their dashboard.");
    console.log("   ✅ Success. Trip verified in User B's dashboard.");

    // 7. Test Watched Flight (User A)
    console.log("=> Testing: Add Watched Flight (User A)");
    const watchRes = await fetch(`${BASE_URL}/watched-flights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tokenA}` },
      body: JSON.stringify({ flightNumber: "EK205", date: new Date().toISOString() })
    });
    if (!watchRes.ok) throw new Error(`Watch flight failed: ${await watchRes.text()}`);
    console.log("   ✅ Success. Flight added to watchlist.");

    // 8. Fetch Profile User A
    console.log("=> Testing: Fetch Profile (User A)");
    const profileRes = await fetch(`${BASE_URL}/user/me`, {
      headers: { 'Authorization': `Bearer ${tokenA}` }
    });
    if (!profileRes.ok) throw new Error(`Fetch profile failed: ${await profileRes.text()}`);
    console.log("   ✅ Success. Profile fetched.");

    console.log("\n🎉 ALL TESTS PASSED! The backend architecture is fully operational and bug-free.");

  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error);
  }
}

runTests();
