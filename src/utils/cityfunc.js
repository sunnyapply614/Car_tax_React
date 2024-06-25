import countries from "./output.json";

export const getCountries = () => {
  return countries;
  // let cou = [];
  // let init = {
  //   country_id: "",
  //   country_name: "",
  //   states: [],
  // };
  // let count = 0;
  // let now_country = "";
  // let temp;
  // countries.map((item) => {
  //   if (now_country !== item.country) {
  //     if (temp) {
  //       cou.push(temp);
  //       now_country = item.country;
  //     }
  //     temp = { ...init };
  //     count++;
  //     temp.country_id = count;
  //     temp.country_name = item.country;
  //   }
  //   temp.states.push({
  //     state_name: item.city,
  //     country_id: count,
  //   });
  // });
  // return cou;
};
