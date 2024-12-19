<template>
  <div class="accordion">
    <div class="accordion-item">
      <div class="accordion-item-headerEmitent">
        <div id="displayName">Топ 5 торгуемых эмитентов</div>
        <div class="year"></div>
      </div>
      <!-- /.accordion-item-header -->
      <div id="accardion-body" class="accordion-item-body">
        <div class="accordion-item-body-content" style="padding: 0">
          <ul class="tabEmitent">
            <li
              id="defaultOpenEmitent"
              class="tablinksEmitent"
              onclick="showEmitent(event, '1111')"
            >
              Топ 5 торгуемых эмитентов
            </li>
            <li class="tablinksEmitent" onclick="showEmitent(event, '2222')">
              Топ 5 эмитенты по прибыли
            </li>
            <!--          <li class="tablinksEmitent" onclick="showEmitent(event, '4444')">ТОП 5 эмитентов не раскрывших информацию</li>-->
          </ul>
        </div>
      </div>
      <!-- /.accordion-item-body -->
    </div>
    <!-- /.accordion-item -->
  </div>

  <div id="1111" class="tabcontentEmitent">
    <!-- <div class="container-title"><span> ТОП 5 торгуемых Эмитентов</span>  </div> -->
  </div>

  <div id="2222" class="tabcontentEmitent">
    <!-- <div class="container-title"><span> ТОП 5 эмитенты по прибыли</span></div> -->

    <div class="top-emitent__container">
      <a target="_blank" class="top-emitent__item">
        <div class="emitent-item__name">
          1.&nbsp;
          <p class="emitent-number">"O'ztransgaz" AJ</p>
        </div>
        <p class="emitent-number">1 897 280 075.00 UZS</p>
      </a>

      <a target="_blank" class="top-emitent__item">
        <div class="emitent-item__name">
          2.&nbsp;
          <p class="emitent-number">"UzAuto Motors" AJ</p>
        </div>
        <p class="emitent-number">258 768 940.23 UZS</p>
      </a>

      <a target="_blank" class="top-emitent__item">
        <div class="emitent-item__name">
          3.&nbsp;
          <p class="emitent-number">"O'zmetkombinat" AJ</p>
        </div>
        <p class="emitent-number">215 425 236.00 UZS</p>
      </a>

      <a target="_blank" class="top-emitent__item">
        <div class="emitent-item__name">
          4. &nbsp;
          <p class="emitent-number">"O'zkimyosanoat" AJ</p>
        </div>
        <p class="emitent-number">115 126 904.70 UZS</p>
      </a>

      <a target="_blank" class="top-emitent__item">
        <div class="emitent-item__name">
          5.&nbsp;
          <p class="emitent-number">"O'zbektelekom" AK</p>
        </div>
        <p class="emitent-number">78 624 754.00 UZS</p>
      </a>
    </div>
  </div>

  <!--      <div id="3333" class="tabcontentEmitent">-->

  <!--        &lt;!&ndash; <div class="container-title"><span> ТОП 5 эмитентов раскрывших информацию </span></div> &ndash;&gt;-->
  <!--        <div class="top-emitent__container">-->
  <!--          {% for emitent in top_emitents %}-->
  <!--          <a target="_blank" class="top-emitent__item">-->
  <!--            <div class="emitent-item__name">-->
  <!--              {{ forloop.counter }}.&nbsp;-->
  <!--              <p class="emitent-number">-->
  <!--                {{ emitent.org_title }}-->
  <!--              </p>-->
  <!--            </div>-->
  <!--            <p class="emitent-number">{{ emitent.number_of_facts }}</p>-->
  <!--          </a>-->
  <!--          {% endfor %}-->
  <!--        </div>-->

  <!--      </div>-->

  <!--      <div id="4444" class="tabcontentEmitent">-->

  <!--        &lt;!&ndash; <div class="container-title"><span> ТОП 5 эмитентов не раскрывших информацию </span></div> &ndash;&gt;-->
  <!--        <div class="top-emitent__container">-->
  <!--          {% for emitent in bottom_emitents %}-->
  <!--          <a target="_blank" class="top-emitent__item">-->
  <!--            <div class="emitent-item__name">-->
  <!--              {{ forloop.counter }}.&nbsp;-->
  <!--              <p class="emitent-number">-->
  <!--                {{ emitent.org_title }}-->
  <!--              </p>-->
  <!--            </div>-->
  <!--            <p class="emitent-number">{{ emitent.number_of_facts }}</p>-->
  <!--          </a>-->
  <!--          {% endfor %}-->
  <!--        </div>-->

  <!--      </div>-->
</template>

<script>
  const accordionItemHeadersEmitent = document.querySelectorAll(
    '.accordion-item-headerEmitent',
  )

  accordionItemHeadersEmitent.forEach((accordionItemHeader) => {
    accordionItemHeader.addEventListener('click', (event) => {
      // Uncomment in case you only want to allow for the display of only one collapsed item at a time!

      // const currentlyActiveAccordionItemHeader = document.querySelector(".accordion-item-header.active");
      // if(currentlyActiveAccordionItemHeader && currentlyActiveAccordionItemHeader!==accordionItemHeader) {
      //    currentlyActiveAccordionItemHeader.classList.toggle("active");
      //    currentlyActiveAccordionItemHeader.nextElementSibling.style.maxHeight = 0;
      //  }

      accordionItemHeader.classList.toggle('active')
      const accordionItemBody = accordionItemHeader.nextElementSibling
      if (accordionItemHeader.classList.contains('active')) {
        accordionItemBody.style.maxHeight =
          accordionItemBody.scrollHeight + 'px'
      } else {
        accordionItemBody.style.maxHeight = 0
      }
    })
  })

  function showEmitent(evt, tabName) {
    let i, tabcontentEmitent, tablinksEmitent
    tabcontentEmitent = document.getElementsByClassName('tabcontentEmitent')
    for (i = 0; i < tabcontentEmitent.length; i++) {
      tabcontentEmitent[i].style.display = 'none'
    }
    tablinksEmitent = document.getElementsByClassName('tablinksEmitent')
    for (i = 0; i < tablinksEmitent.length; i++) {
      tablinksEmitent[i].className = tablinksEmitent[i].className.replace(
        ' active',
        '',
      )
    }
    document.getElementById(tabName).style.display = 'block'
    evt.currentTarget.className += ' active'
    const newValue = evt.target.innerText

    document.getElementById('displayName').innerHTML = newValue
    // document.getElementById('displayName').innerHTML += ' &nbsp &nbsp <div class="year">Filter &nbsp   <img class="arr-down-emitent" src="{% static "main/img/arr-down.svg" %}"/> </div>'

    //   document.getElementById("active-accardion").classList.remove("active")
    // document.getElementsByClassName('accordion-item-body').style.maxHeight = 0;
  }

  // Get the element with id="defaultOpen" and click on it
  // document.getElementById("defaultOpenEmitent").click()
</script>

<style scoped>
  .calendar-icon {
    width: 20px;
    height: 20px;
  }

  .main-chart {
    min-width: 365px;
    min-height: 450px;
    width: 100%;
    margin-top: 10px;
  }

  .container-title {
    text-transform: uppercase;
    color: #fff;
    background: rgb(18 68 131);
    display: flex !important;
    justify-content: center;
    padding: 5px 20px;
    border-radius: 10px 10px 0 0 !important;
    align-items: center;
    height: 55px;
  }

  .top-emitent__container {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 4px 6px rgba(181, 181, 181, 0.25);
    border-radius: 0 0 10px 10px;
    margin-bottom: 10px;
  }

  .top-emitent__item {
    align-items: center;
    justify-content: space-between;
    text-decoration: none;
    gap: 10px;
    align-items: center;
    height: 60px;
    padding: 5px 15px;
    border-bottom: 1px dashed #9e9e9e;
    display: flex;

    /* justify-content: space-between; */
  }

  .carousel__item:hover {
    background: #e6f3ff;
  }

  .top-emitent__item:last-child {
    border-bottom: none;
    border-radius: 0 0 10px 10px;
  }

  .top-emitent__item:hover {
    text-decoration: none;
    background-color: #e6f3ff;
  }

  .emitent-item__name {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #6b6969;
    font-weight: 700;

    /* justify-content: space-between; */
  }

  .emitent-number {
    justify-content: flex-end;
    float: right;
    margin: 0;
  }

  .emitent-buttons {
    display: flex;
    font-weight: bold;
    flex-direction: column;
  }

  .emitent-icon {
    width: 60px;
    margin: 0 10px;
  }

  .up-button {
    padding: 2px 6px;
    background: none;
    border: none;
  }

  .accordion {
    width: 100%;
    margin-top: 20px;
  }

  .accordion-item {
    background: #ffffff;
    position: relative;
  }

  .accordion-item-headerEmitent {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    /* identical to box height */
    background: #124483;
    border-radius: 10px 10px 0px 0px;
    color: #fff;
    font-weight: bold;
    display: flex;
    position: relative;
    cursor: pointer;
    user-select: none;
    padding: 15px 20px;
    justify-content: space-between;
    align-items: center;
  }

  .accordion-item-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    /* width: 100%; */
  }

  .accordion-item-body-content {
    font-weight: 700;
    font-size: 18px;
    color: #124483;
    background: #eee;
  }

  @media (max-width: 767px) {
    html {
      font-size: 14px;
    }
  }

  .tabEmitent {
    width: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
  }

  ul.tab {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  li.tablinksEmitent {
    font-size: 14px;
    cursor: pointer;
    padding: 8px 25px;
  }

  li.tablinksEmitent:hover {
    background-color: #fff;
  }

  .year {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    padding: 5px 15px;
    border-radius: 10px;
    color: #094580;
  }
</style>
