import axios from 'axios'
import { ElNotification } from 'element-plus'
import { ref } from 'vue'

const options = [
  {
    value: 'facts/',
    label: 'Все',
  },
  {
    value: 'fact1/',
    label: '1.Изменение наименования',
  },
  {
    value: 'fact2/',
    label:
      '2.Изменение местонахождения (почтового адреса), адреса электронной почты или веб-сайта',
  },
  {
    value: 'fact3/',
    label: '3.Реорганизация',
  },
  {
    value: 'fact4/',
    label: '4.Приостановление деятельности',
  },
  {
    value: 'fact5/',
    label: '5.Прекращение деятельности',
  },

  {
    value: 'fact6/',
    label:
      '6.Решения, принятые высшим органом управления эмитента, в том числе решения наблюдательного совета хозяйственных обществ о выпуске акций, корпоративных облигаций и иных ценных бумаг',
  },
  {
    value: 'fact7/',
    label: '7.Изменение прав на ценные бумаги',
  },
  {
    value: 'fact8/',
    label:
      '8.Изменение в составе наблюдательного совета, ревизионной комиссии или исполнительного органа',
  },
  {
    value: 'fact9/',
    label: '9.Изменения в перечне филиалов',
  },
  {
    value: 'fact10/',
    label: '10.Изменения в перечне представительств',
  },
  {
    value: 'fact11/',
    label: '11.Изменения в перечне дочерних хозяйственных обществ',
  },
  {
    value: 'fact12/',
    label: '12.Изменения в перечне зависимых хозяйственных обществ',
  },
  {
    value: 'fact13/',
    label: '13.Прекращение деятельности',
  },
  {
    value: 'fact14/',
    label:
      '14.Предъявление иска к эмитенту в размере, превышающем 10 процентов стоимости активов',
  },
  {
    value: 'fact15/',
    label:
      '15.Получение кредита в размере, превышающем 50 процентов уставного капитала',
  },
  {
    value: 'fact16/',
    label: '16.Получение кредита в размере, превышающем 50 процентов активов',
  },
  {
    value: 'fact17/',
    label: '17.Разовое увеличение стоимости активов более чем на 10 процентов',
  },
  {
    value: 'fact18/',
    label: '18.Разовое уменьшение стоимости активов более чем на 10 процентов',
  },
  {
    value: 'fact19/',
    label:
      '19.Разовые сделки эмитента, размер которых либо стоимость имущества по которым составляет более 10 процентов от активов эмитента',
  },
  {
    value: 'fact20/',
    label: '20.Заключение эмитентом крупной сделки',
  },
  {
    value: 'fact21/',
    label: '21.Заключение сделки с аффилированным лицом',
  },
  {
    value: 'fact22/',
    label:
      '22.Получение лицензии на осуществление отдельных видов деятельности',
  },
  {
    value: 'fact23/',
    label:
      '23.Аннулирование лицензии либо прекращение действия лицензии, выданной на осуществление отдельных видов деятельности',
  },
  {
    value: 'fact24/',
    label:
      '24.Приостановление действия лицензии, выданной на осуществление отдельных видов деятельности',
  },
  {
    value: 'fact25/',
    label: '25.Выпуск ценных бумаг',
  },
  {
    value: 'fact26/',
    label: '26.Приостановление выпуска ценных бумаг ',
  },
  {
    value: 'fact27/',
    label: '27.Возобновление выпуска ценных бумаг',
  },
  {
    value: 'fact28/',
    label: '28.Признание выпуска ценных бумаг несостоявшимся ',
  },
  {
    value: 'fact29/',
    label: '29.Признание выпуска ценных бумаг недействительным',
  },
  {
    value: 'fact30/',
    label:
      '30.Изменения в списке юридических лиц, в которых эмитент обладает  10 и более процентами акций (долей, паев)',
  },
  {
    value: 'fact31/',
    label:
      '31.Наступление сроков исполнения обязательств эмитента по выкупу (погашению) ценных бумаг',
  },
  {
    value: 'fact32/',
    label: '32.Начисление доходов по ценным бумагам',
  },
  {
    value: 'fact33/',
    label: '33.Введение процедуры банкротства в отношении эмитента',
  },
  {
    value: 'fact34/',
    label:
      '34.Изменения во владении членов наблюдательного совета акциями эмитента',
  },
  {
    value: 'fact35/',
    label:
      '35.Изменения во владении членов исполнительного органа акциями эмитента',
  },
  {
    value: 'fact36/',
    label: '36.Изменения в списке аффилированных лиц',
  },
  {
    value: 'fact37/',
    label:
      '37.Возникновение у владельцев ценных бумаг права требования выкупа эмитентом принадлежащих им ценных бумаг',
  },
  {
    value: 'fact38/',
    label:
      '38.Включение ценных бумаг эмитента в листинг разрешенных к торгам на иностранных и/или местных организованных (регулируемых) финансовых рынках',
  },
  {
    value: 'fact39/',
    label:
      '39.Исключение ценных бумаг эмитента из списка разрешенных к обращению на иностранных и (или) местных организованных (регулируемых) финансовых рынках',
  },

  {
    value: 'fact40/',
    label:
      '40.Внесение изменений и (или) дополнений в решение о выпуске ценных бумаг',
  },
  {
    value: 'fact41/',
    label:
      '41.Рекомендация (предложение) Наблюдательного совета по распределению чистой прибыли (дивиденда)',
  },
  {
    value: 'fact42/',
    label: '42.Дивиденды, выплаченные акционерам эмитентом',
  },
  {
    value: 'fact43/',
    label:
      '43.В результате сделки владелец ценных бумаг становится владельцем 35 и более процентов любого вида ценных бумаг эмитента.',
  },
  {
    value: 'fact44/',
    label:
      '44.Приобретение акционером пакета акций, составляющего 20 и более процентов от общего размера уставного капитала акционерного общества',
  },
  {
    value: 'fact45/',
    label:
      '45.Предложение лица, владеющего 50% и более акций общества, продать акции оставшимся акционерам по рыночной стоимости',
  },
]
export default options

// const factNumberData = ref([])
//
// const getFactNumber = ()=> {
//     for (let i = 1; i <= 45 ; i++) {
//
//         axios.get(`${url}/disclosure/fact${i}/`, {
//             method: 'get',
//         })
//             .then(response => {
//                 factNumberData.value.push({ value: `fact${i}`, label :  response.data.results.length ? response.data.results[0].fact_title : '' } )
//
//             })
//             .catch(({response}) => {
//                 console.log(i, 'number')
//                 ElNotification({
//                     type: "error",
//                     message: response.data.message || "Malumot olishda xatolik bor!"
//
//                 })
//
//             })
//
//
//
//     }
//     console.log(factNumberData.value)
// }
//
