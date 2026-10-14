export default [
	{
		id: 1,
		name: "Силиконовый стакан",
		image: new URL("../assets/img/prizes/gift_1.webp", import.meta.url).href,
		points_cost: 100,
		category: "individual_cat1",
		is_available: true,
		is_physical: true,
		user_type: "individual"
	},
	{
		id: 2,
		name: "Худи",
		image: new URL("../assets/img/prizes/gift_2.webp", import.meta.url).href,
		points_cost: 200,
		category: "individual_cat1",
		is_available: true,
		is_physical: true,
		user_type: "individual"
	},
	{
		id: 3,
		name: "Сертификат OZON на 500 ₽",
		image: new URL("../assets/img/prizes/gift_3.webp", import.meta.url).href,
		points_cost: 500,
		category: "individual_cat2",
		is_available: true,
		is_physical: false,
		user_type: "individual"
	},
	{
		id: 4,
		name: "Сертификат Яндекс Маркет на 500 ₽",
		image: new URL("../assets/img/prizes/gift_4.webp", import.meta.url).href,
		points_cost: 500,
		category: "individual_cat2",
		is_available: true,
		is_physical: false,
		user_type: "individual"
	},
	{
		id: 5,
		name: "Стикерпак в Телеграм",
		image: new URL("../assets/img/prizes/gift_5.webp", import.meta.url).href,
		points_cost: 50,
		category: "individual_cat1",
		is_available: true,
		is_physical: false,
		user_type: "individual"
	}
];
