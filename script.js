let userLatitude = null;
let userLongitude = null;

const planButton = document.getElementById("planButton");
const result = document.getElementById("result");

const cityInput = document.getElementById("city");
const districtInput = document.getElementById("district");
const useLocationButton = document.getElementById("useLocationButton");


// ======================================================
// AKTİVİTELER
// ======================================================

const activities = [

    {
        name: "Bowling",
        type: "eglence",
        time: 2,
        price: 250,
        maxPeople: 6,
        indoor: true
    },

    {
        name: "Sinema",
        type: "eglence",
        time: 2,
        price: 500,
        maxPeople: 10,
        indoor: true
    },

    {
        name: "Kafede Kahve",
        type: "yemek",
        time: 1,
        price: 150,
        indoor: true
    },

    {
        name: "Restoranda Yemek",
        type: "yemek",
        time: 2,
        price: 400,
        indoor: true
    },

    {
        name: "Müze Gezisi",
        type: "kultur",
        time: 2,
        price: 100,
        indoor: true
    },

    {
        name: "Sanat Galerisi",
        type: "kultur",
        time: 2,
        price: 0,
        indoor: true
    },

    {
        name: "Parkta Yürüyüş",
        type: "dogada",
        time: 1,
        price: 0,
        indoor: false
    },

    {
        name: "Doğa Yürüyüşü",
        type: "dogada",
        time: 3,
        price: 0,
        indoor: false
    },

    {
        name: "Bisiklet Sürme",
        type: "spor",
        time: 2,
        price: 100,
        indoor: false
    },

    {
        name: "Yüzme",
        type: "spor",
        time: 2,
        price: 250,
        indoor: true
    },

    {
        name: "Fitness",
        type: "spor",
        time: 1,
        price: 200,
        indoor: true
    },

    {
        name: "Oyun Salonu",
        type: "eglence",
        time: 2,
        price: 300,
        indoor: true
    },

    {
        name: "Escape Room",
        type: "eglence",
        time: 2,
        price: 500,
        indoor: true
    },

    {
        name: "Piknik",
        type: "dogada",
        time: 3,
        price: 200,
        indoor: false
    },

    {
        name: "Kütüphanede Kitap Okuma",
        type: "sakin",
        time: 2,
        price: 0,
        indoor: true
    },

    {
        name: "Evde Film Gecesi",
        type: "sakin",
        time: 3,
        price: 150,
        indoor: true
    },

    {
        name: "Sahilde Yürüyüş",
        type: "dogada",
        time: 2,
        price: 0,
        indoor: false
    },

    {
        name: "Karaoke",
        type: "eglence",
        time: 2,
        price: 350,
        indoor: true
    },

    {
        name: "Kahvaltı",
        type: "yemek",
        time: 2,
        price: 300,
        indoor: true
    },

    {
        name: "Tiyatro",
        type: "kultur",
        time: 3,
        price: 450,
        indoor: true
    }

];


// ======================================================
// TÜRKİYE İLLERİNİ GETİR
// ======================================================

async function loadCities() {

    try {

        const response = await fetch(
            "https://api.turkiyeapi.dev/v2/provinces?fields=id,name&limit=100"
        );

        if (!response.ok) {
            throw new Error("Şehirler alınamadı.");
        }

        const data = await response.json();

        cityInput.innerHTML =
            '<option value="">Şehir seçiniz</option>';

        data.data.forEach(function (city) {

            const option = document.createElement("option");

            option.value = city.id;
            option.textContent = city.name;

            cityInput.appendChild(option);

        });

    } catch (error) {

        console.error("Şehirler yüklenemedi:", error);

        cityInput.innerHTML =
            '<option value="">Şehirler yüklenemedi</option>';

    }

}


// ======================================================
// SEÇİLEN ŞEHRİN İLÇELERİNİ GETİR
// ======================================================

cityInput.addEventListener("change", async function () {

    const cityId = cityInput.value;

    districtInput.innerHTML =
        '<option value="">İlçe seçiniz</option>';

    districtInput.disabled = true;

    if (!cityId) {
        return;
    }

    try {

        const response = await fetch(
            `https://api.turkiyeapi.dev/v2/provinces/${cityId}/districts?limit=1000`
        );

        if (!response.ok) {
            throw new Error("İlçeler alınamadı.");
        }

        const data = await response.json();

        data.data.forEach(function (district) {

            const option = document.createElement("option");

            option.value = district.id;
            option.textContent = district.name;

            districtInput.appendChild(option);

        });

        districtInput.disabled = false;

    } catch (error) {

        console.error("İlçeler yüklenemedi:", error);

        districtInput.innerHTML =
            '<option value="">İlçeler yüklenemedi</option>';

    }

});


// ======================================================
// HAVA DURUMUNU GETİR
// ======================================================

async function getWeather(city) {

    const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=tr&format=json`
    );

    if (!geoResponse.ok) {
        throw new Error("Şehir bilgisi alınamadı.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
        throw new Error("Şehir bulunamadı.");
    }

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,precipitation,weather_code&timezone=auto`
    );

    if (!weatherResponse.ok) {
        throw new Error("Hava durumu alınamadı.");
    }

    const weatherData = await weatherResponse.json();

    return weatherData.current;

}
// ======================================================
// İKİ KONUM ARASINDAKİ MESAFE
// ======================================================

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}

// ======================================================
// GERÇEK MEKANLARI GETİR
// ======================================================

async function getRealPlaces(city, district, activity) {

    // İlçenin koordinatlarını bul
    const geoResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(district + ", " + city + ", Türkiye")}&limit=1&accept-language=tr`
    );

    if (!geoResponse.ok) {
        throw new Error("İlçe konumu bulunamadı.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.length) {
        throw new Error("İlçe bulunamadı.");
    }

    const latitude = Number(geoData[0].lat);
    const longitude = Number(geoData[0].lon);


    // Aktivite türüne göre OpenStreetMap sorgusu
    let tagQuery = "";


    if (activity === "yemek") {

        tagQuery = `
            nwr["amenity"~"cafe|restaurant|fast_food"](around:5000,${latitude},${longitude});
        `;

    } else if (activity === "eglence") {

        tagQuery = `
            nwr["amenity"~"cinema|theatre|bowling_alley|karaoke_box|escape_game|arts_centre"](around:5000,${latitude},${longitude});
        `;

    } else if (activity === "kultur") {

        tagQuery = `
            nwr["tourism"~"museum|gallery"](around:5000,${latitude},${longitude});
        `;

    } else if (activity === "spor") {

        tagQuery = `
            nwr["leisure"~"fitness_centre|sports_centre|swimming_pool"](around:5000,${latitude},${longitude});
        `;

    } else if (activity === "dogada") {

        tagQuery = `
            nwr["leisure"~"park|nature_reserve"](around:5000,${latitude},${longitude});
        `;

    } else if (activity === "sakin") {

        tagQuery = `
            nwr["amenity"~"library"](around:5000,${latitude},${longitude});
        `;

    } else {

        tagQuery = `
            nwr["name"](around:5000,${latitude},${longitude});
        `;

    }


    const query = `
        [out:json][timeout:25];
        (
            ${tagQuery}
        );
        out center tags;
    `;


   const response = await fetch(
    "https://overpass.kumi.systems/api/interpreter",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            data: query
        })
    }
);


    if (!response.ok) {
        throw new Error("Gerçek mekanlar alınamadı.");
    }


    const data = await response.json();


    return data.elements
        .filter(function (place) {

            return place.tags && place.tags.name;

        })
        .map(function (place) {

            const lat =
                place.lat ||
                place.center?.lat;

            const lon =
                place.lon ||
                place.center?.lon;

            return {

                name: place.tags.name,

                address:
                    place.tags["addr:street"] ||
                    place.tags["addr:full"] ||
                    "Adres bilgisi bulunamadı",

                latitude: lat,

                longitude: lon,distance: calculateDistance(
        userLatitude ?? latitude,
        luserLongitude ?? longitude,
        lat,
        lon
    ),

                website:
                    place.tags.website ||
                    "",

                phone:
                    place.tags.phone ||
                    ""

            };

        });

}


// ======================================================
// KONUMUMU KULLAN
// ======================================================

useLocationButton.addEventListener("click", function () {

    if (!navigator.geolocation) {

        alert(
            "Tarayıcınız konum özelliğini desteklemiyor."
        );

        return;
    }


    useLocationButton.textContent =
        "📍 Konum alınıyor...";


    navigator.geolocation.getCurrentPosition(

        async function (position) {
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log("Enlem:", latitude);
            console.log("Boylam:", longitude);


            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=tr`
                );


                if (!response.ok) {
                    throw new Error(
                        "Konum bilgisi alınamadı."
                    );
                }


                const data = await response.json();

                console.log(
                    "Konum bilgisi:",
                    data
                );


                const address = data.address || {};


                const cityName =
                    address.province ||
                    address.state ||
                    "";


                const districtName =
                    address.town ||
                    address.city_district ||
                    address.municipality ||
                    "";


                console.log(
                    "Şehir:",
                    cityName
                );

                console.log(
                    "İlçe:",
                    districtName
                );


                // ŞEHİR LİSTESİNDE BUL

                let cityFound = false;


                for (
                    let i = 0;
                    i < cityInput.options.length;
                    i++
                ) {

                    if (
                        cityInput.options[i].textContent
                            .toLowerCase()
                        === cityName.toLowerCase()
                    ) {

                        cityInput.value =
                            cityInput.options[i].value;

                        cityFound = true;

                        break;
                    }

                }


                if (cityFound) {

                    cityInput.dispatchEvent(
                        new Event("change")
                    );


                    setTimeout(function () {

                        for (
                            let i = 0;
                            i < districtInput.options.length;
                            i++
                        ) {

                            if (
                                districtInput.options[i]
                                    .textContent
                                    .toLowerCase()
                                === districtName.toLowerCase()
                            ) {

                                districtInput.value =
                                    districtInput.options[i].value;

                                break;
                            }

                        }

                    }, 1000);

                }


                useLocationButton.textContent =
                    "✅ Konum Alındı";


            } catch (error) {

                console.error(
                    "Konum bilgisi alınamadı:",
                    error
                );


                alert(
                    "Konum bilgisi alınamadı. Şehir ve ilçeyi manuel olarak seçebilirsin."
                );


                useLocationButton.textContent =
                    "📍 Konumumu Kullan";

            }

        },


        function (error) {

            console.error(
                "GPS hatası:",
                error
            );


            alert(
                "Konum izni verilmedi veya konum alınamadı. Şehir ve ilçeyi manuel olarak seçebilirsin."
            );


            useLocationButton.textContent =
                "📍 Konumumu Kullan";

        }

    );

});


// ======================================================
// BUTONA TIKLANINCA
// ======================================================

planButton.addEventListener(
    "click",
    async function () {


        const timeInput =
            document.getElementById("time");

        const budgetInput =
            document.getElementById("budget");

        const peopleInput =
            document.getElementById("people");

        const activityInput =
            document.getElementById("activity");


        const city =
            cityInput.options[
                cityInput.selectedIndex
            ]?.textContent || "";


        const district =
            districtInput.options[
                districtInput.selectedIndex
            ]?.textContent || "";


        const time =
            Number(timeInput.value);


        const budget =
            Number(budgetInput.value);


        const people =
            Number(peopleInput.value);


        const activity =
            activityInput.value;


        // KONTROLLER

        if (!cityInput.value) {

            alert(
                "Lütfen bir şehir seç."
            );

            return;
        }


        if (!districtInput.value) {

            alert(
                "Lütfen bir ilçe seç."
            );

            return;
        }


        if (!time) {

            alert(
                "Lütfen ne kadar zamanın olduğunu seç."
            );

            return;
        }


        if (!budgetInput.value) {

            alert(
                "Lütfen bütçeni gir."
            );

            return;
        }


        if (!people) {

            alert(
                "Lütfen kişi sayısını seç."
            );

            return;
        }


        planButton.disabled = true;

        planButton.textContent =
            "Plan hazırlanıyor...";


        try {


            // ==================================================
            // HAVA DURUMUNU AL
            // ==================================================

            const weatherData =
                await getWeather(city);


            console.log(
                "Hava durumu:",
                weatherData
            );


            // YAĞMUR VAR MI?

            const isRainy =
                weatherData.precipitation > 0;


            console.log(
                "Yağmur var mı:",
                isRainy
            );


            // ==================================================
            // UYGUN AKTİVİTELER
            // ==================================================

            let suitableActivities;


            if (activity === "") {

                suitableActivities =
                    activities.filter(
                        function (item) {

                            return (
                                item.time <= time &&
                                item.price * people <= budget &&
                                (
                                    !item.maxPeople ||
                                    people <= item.maxPeople
                                ) &&
                                (
                                    !isRainy ||
                                    item.indoor === true
                                )
                            );

                        }
                    );

            } else {

                suitableActivities =
                    activities.filter(
                        function (item) {

                            return (
                                item.type === activity &&
                                item.time <= time &&
                                item.price * people <= budget &&
                                (
                                    !item.maxPeople ||
                                    people <= item.maxPeople
                                ) &&
                                (
                                    !isRainy ||
                                    item.indoor === true
                                )
                            );

                        }
                    );

            }


            // ==================================================
            // AKTİVİTELERE PUAN VER
            // ==================================================

            suitableActivities.forEach(
                function (item) {

                    item.score = 0;


                    if (
                        isRainy &&
                        item.indoor === true
                    ) {

                        item.score += 10;

                    }


                    if (
                        !isRainy &&
                        item.indoor === false
                    ) {

                        item.score += 10;

                    }


                    if (
                        activity !== "" &&
                        item.type === activity
                    ) {

                        item.score += 20;

                    }


                    const totalPrice =
                        item.price * people;


                    if (
                        totalPrice <= budget
                    ) {

                        item.score += 5;

                    }

                }
            );


            // PUANA GÖRE SIRALA

            suitableActivities.sort(
                function (a, b) {

                    return b.score - a.score;

                }
            );


            console.log(
                "Şehir:",
                city
            );

            console.log(
                "İlçe:",
                district
            );

            console.log(
                "Zaman:",
                time
            );

            console.log(
                "Bütçe:",
                budget
            );

            console.log(
                "Kişi:",
                people
            );

            console.log(
                "Aktivite:",
                activity
            );


            result.innerHTML = "";


            // ==================================================
            // AKTİVİTE YOKSA
            // ==================================================

            if (
                suitableActivities.length === 0
            ) {

                result.innerHTML = `

                    <div class="activity-card">

                        <h2>
                            😔 Uygun aktivite bulunamadı
                        </h2>

                        <p>
                            Zamanını, bütçeni veya aktivite tercihini değiştirmeyi deneyebilirsin.
                        </p>

                    </div>

                `;

                return;
            }


            // ==================================================
            // BAŞLIK
            // ==================================================

            result.innerHTML = `

                <div class="activity-card">

                    <h2>
                        📍 ${city} / ${district}
                    </h2>

                    <p>
                        🌡️ ${weatherData.temperature_2m}°C
                    </p>

                    <p>
                        ${isRainy ? "🌧️ Yağış var" : "☀️ Yağış yok"}
                    </p>

                </div>

            `;


            // ==================================================
            // GERÇEK MEKANLARI GETİR
            // ==================================================

           
            let realPlaces = [];

if (activity !== "") {

    try {

        realPlaces =
            await getRealPlaces(
                city,
                district,
                activity
            );

    } catch (error) {

        console.error(
            "Gerçek mekanlar alınamadı:",
            error
        );

        realPlaces = [];

    }

}


            console.log(
                "Gerçek mekanlar:",
                realPlaces
            );


            // ==================================================
            // GERÇEK MEKANLARI GÖSTER
            // ==================================================

            if (realPlaces.length > 0) {

                realPlaces
                    .slice(0, 10)
                    .forEach(
                        function (place) {

                            result.innerHTML += `

                                <div class="activity-card">

                                    <h2>
                                        📍 ${place.name}
                                    </h2>

                                    <p>
                                        🏙️ ${city} / ${district}
                                    </p>

                                    <p>
                                        📌 ${place.address}
                                    </p>
                                    <p>
    📏 ${place.distance.toFixed(1)} km uzaklıkta
</p>

                                    ${
                                        place.phone
                                        ? `<p>📞 ${place.phone}</p>`
                                        : ""
                                    }

                                    ${
                                        place.website
                                        ? `
                                            <p>
                                                🌐
                                                <a
                                                    href="${place.website}"
                                                    target="_blank"
                                                >
                                                    Web sitesi
                                                </a>
                                            </p>
                                        `
                                        : ""
                                    }

                                </div>

                            `;

                        }
                    );

            } else {

                result.innerHTML += `

                    <div class="activity-card">

                        <h2>
                            😔 Gerçek mekan bulunamadı
                        </h2>

                        <p>
                            Bu bölgede OpenStreetMap üzerinde uygun mekan bulunamadı.
                        </p>

                    </div>

                `;

            }


        } catch (error) {

            console.error(
                "Hata:",
                error
            );


            result.innerHTML = `

                <div class="activity-card">

                    <h2>
                        ⚠️ Bir hata oluştu
                    </h2>

                    <p>
                        Hava durumu veya gerçek mekan bilgisi alınamadı.
                    </p>

                    <p>
                        Lütfen internet bağlantını kontrol edip tekrar dene.
                    </p>

                </div>

            `;

        } finally {

            planButton.disabled = false;

            planButton.textContent =
                "Bana Plan Bul ✨";

        }

    }
);


// ======================================================
// UYGULAMA BAŞLARKEN ŞEHİRLERİ YÜKLE
// ======================================================

loadCities();