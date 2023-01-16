"use strict";

const formatDate = (companyName) => {
  let currentTime = new Date().getHours();

  if (currentTime < 12) {
    $("#timeDiv").append(`Good Morning, ${companyName}`);
  } else if (currentTime < 18) {
    $("#timeDiv").append(`Good Afternoon, ${companyName}`);
  } else {
    $("#timeDiv").append(`Good Evening, ${companyName}`);
  }
};

const baseUrl = "http://localhost:3000";

$(() => {
  formatDate("ACS");

  $.ajax({
    url: `${baseUrl}/portalAccess`,
    type: "GET",
    contentType: "application/json",
    success: function (res) {
      $.each(res, (index, result) => {
        $("#memberAccess").append(
          `<div class="col-lg-2 col-sm-6">
			<div class="card card-sm">
			  <div class="card-body">
				<span
				  class="d-block font-11 font-weight-500 text-dark text-uppercase mb-10"
				  >${result.title}</span
				>
				<div
				  class="d-flex align-items-center justify-content-between position-relative"
				>
				  <div>
					<span
					  class="d-block display-5 font-weight-400 text-dark"
					  >${result.total}</span
					>
				  </div>
				  
				</div>
			  </div>
			</div>
		  </div>`
        );
      });
    },
  });

  $.ajax({
    url: `${baseUrl}/memberBalances`,
    type: "GET",
    contentType: "application/json",
    success: function (res) {
      $.each(res, (index, result) => {
        $("#memberBalances").append(
          `<div class="col-lg-4 col-sm-6">
			<div class="card card-sm">
			  <div class="card-body">
				<span
				  class="d-block font-11 font-weight-500 text-dark text-uppercase mb-10"
				  >${result.title}</span
				>
				<div
				  class="d-flex align-items-center justify-content-between position-relative"
				>
				  <div>
					<span
					  class="d-block display-5 font-weight-400 text-dark"
					  >KES ${result.balance}</span
					>
				  </div>
				</div>
			  </div>
			</div>
		  </div>`
        );
      });
    },
  });

  $.ajax({
    url: `${baseUrl}/balances`,
    type: "GET",
    contentType: "application/json",
    success: async (response) => {
      $.each(response, (index, result) => {
        $("#paybill").html(`${result.paybill}`);
        $("#account").html(`${result.account}`);
        $("#balance").html(`${result.balance}`);
      });
    },
  });

  $.ajax({
    url: `${baseUrl}/tickets`,
    type: "GET",
    contentType: "application/json",
    success: (response) => {
      $.each(response, (index, result) => {
        console.log(result);
        $("#tableRow").append(`
						<tr>
                            <td>
                              ${index + 1}
                            </td>
                            <td>${result.title}</td>
                            <td>${result.name}</td>
                            <td>
                              <span class="badge badge-success">${
                                result.status
                              }</span>
                            </td>
							<td>
							<span class="badge badge-secondary">${result.priority}</span>
						  </td>
                            
                            <td>${result.messasge}</td>
                        </tr>
			`);
      });
    },
  });

  $.ajax({
    url: `${baseUrl}/invoices`,
    type: "GET",
    contentType: "application/json",
    success: (response) => {
      $("#totalInvoices").html(`${response.length}`);

      const paidInvoincesCount = response.filter(
        (i) => i.amount === i.paid
      ).length;
      const paidInvoicePercentage = (
        (paidInvoincesCount / response.length) *
        100
      ).toFixed(2);

      const partialInvoiceCount = response.filter(
        (i) => i.paid < i.amount
      ).length;

      const partialInvoicePercentage = (
        (partialInvoiceCount / response.length) *
        100
      ).toFixed(2);

      console.log(paidInvoicePercentage);

      const unpaidInvoiceCount = response.filter((i) => i.paid == 0).length;
      const unpaidInvoicePercentage = (
        (unpaidInvoiceCount / response.length) *
        100
      ).toFixed(2);

      $("#invoiceProgress").append(
        `<div class="progress-lb-wrap mb-10">
		<label class="progress-label mnw-50p"
		  >${paidInvoicePercentage}%
		<span class="text-light ml-5"> (${paidInvoincesCount}) Fully Paid</span>
		</label>
		<div
		  class="progress progress-bar-rounded progress-bar-xs"
		>
		  <div
		  style="width: ${paidInvoicePercentage}%"
			class="progress-bar bg-success"
			role="progressbar"
			aria-valuenow=${paidInvoicePercentage}
			aria-valuemin="0"
			aria-valuemax="100"
		  ></div>
		</div>
	  </div>
	  <div class="progress-lb-wrap mb-10">
		<label class="progress-label mnw-50p"
		  >${partialInvoicePercentage}%
		<span class="text-light ml-5"> (${partialInvoiceCount}) Partially Paid</span>
		</label>
		<div
		  class="progress progress-bar-rounded progress-bar-xs"
		>
		  <div
		  style="width: ${partialInvoicePercentage}%"
			class="progress-bar bg-warning"
			role="progressbar"
			aria-valuenow=${partialInvoicePercentage}
			aria-valuemin="0"
			aria-valuemax="100"
		  ></div>
		</div>
	  </div>
	  <div class="progress-lb-wrap mb-10">
		<label class="progress-label mnw-50p"
		  >${unpaidInvoicePercentage}%
		<span class="text-light ml-5"> (${unpaidInvoiceCount}) Unpaid</span>
		</label>
		<div
		  class="progress progress-bar-rounded progress-bar-xs"
		>
		  <div
		  style="width: ${unpaidInvoicePercentage}%"
			class="progress-bar bg-primary"
			role="progressbar"
			aria-valuenow=${unpaidInvoicePercentage}
			aria-valuemin="0"
			aria-valuemax="100"
		  ></div>
		</div>
	  </div>
		`
      );
    },
  });

  $.ajax({
    url: `${baseUrl}/chapterMembers`,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      console.log("res", response);
      var xLabels = response.map((data) => {
        return data.label;
      });

      console.log(xLabels);
      var yValues = response.map((data) => {
        return data.quantity;
      });
      var eChart_1 = echarts.init(document.getElementById("m_chart_1"));
      var option5 = {
        color: ["#1d4ed8ff"],
        tooltip: {
          show: true,
          trigger: "axis",
          backgroundColor: "#fff",
          borderRadius: 6,
          padding: 6,
          axisPointer: {
            lineStyle: {
              width: 0,
            },
          },
          textStyle: {
            color: "#324148",
            fontFamily:
              '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
            fontSize: 12,
          },
        },

        grid: {
          top: "3%",
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: xLabels,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#5e7d8a",
              },
              interval: 0,
              rotate: 20,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                color: "#5e7d8a",
              },
            },
            splitLine: {
              lineStyle: {
                color: "#eaecec",
              },
            },
          },
        ],
        series: [
          {
            name: "members",
            type: "line",
            selectedMode: "single",
            barMaxWidth: 40,
            data: yValues,
            smooth: true,
          },
        ],
      };

      eChart_1.setOption(option5);
      eChart_1.resize();
    },
  });

  if ($("#pie_chart_1").length > 0) {
    $("#pie_chart_1").easyPieChart({
      barColor: "#00acf0",
      lineWidth: 3,
      animate: 3000,
      size: 50,
      lineCap: "square",
      scaleColor: "#f5f5f6",
      trackColor: "#f5f5f6",
      onStep: function (from, to, percent) {
        $(this.el).find(".percent").text(Math.round(percent));
      },
    });
  }
  if ($("#pie_chart_2").length > 0) {
    $("#pie_chart_2").easyPieChart({
      barColor: "#00acf0",
      lineWidth: 3,
      animate: 3000,
      size: 50,
      lineCap: "square",
      scaleColor: "#f5f5f6",
      trackColor: "#f5f5f6",
      onStep: function (from, to, percent) {
        $(this.el).find(".percent").text(Math.round(percent));
      },
    });
  }

  if ($(".risk-switch").length > 0)
    $(".risk-switch").toggles({
      drag: true, // allow dragging the toggle between positions
      click: true, // allow clicking on the toggle
      text: {
        on: "", // text for the ON position
        off: "", // and off
      },
      on: false, // is the toggle ON on init
      animate: 250, // animation time (ms)
      easing: "swing", // animation transition easing function
      checkbox: null, // the checkbox to toggle (for use in forms)
      clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)

      type: "compact", // if this is set to 'select' then the select style toggle will be used
    });
});

/*****E-Charts function start*****/
var echartsConfig = function () {
  if ($("#e_chart_4").length > 0) {
    var eChart_4 = echarts.init(document.getElementById("e_chart_4"));
    var option4 = {
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        borderRadius: 6,
        padding: 6,
        axisPointer: {
          lineStyle: {
            width: 0,
          },
        },
        textStyle: {
          color: "#324148",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
          fontSize: 12,
        },
      },
      grid: {
        top: "3%",
        left: "3%",
        right: "3%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#5e7d8a",
          },
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#5e7d8a",
          },
        },
        splitLine: {
          lineStyle: {
            color: "#eaecec",
          },
        },
      },

      series: [
        {
          data: [420, 332, 401, 334, 400, 330, 410],
          type: "line",
          symbolSize: 0,
          itemStyle: {
            color: "#ffbf36",
          },
          lineStyle: {
            color: "#ffbf36",
            width: 0,
          },
          areaStyle: {
            color: "#ffbf36",
            opacity: 1,
          },
        },
        {
          data: [220, 182, 291, 134, 290, 130, 210],
          type: "line",
          symbolSize: 0,
          itemStyle: {
            color: "#f83f37",
          },
          lineStyle: {
            color: "#f83f37",
            width: 0,
          },
          areaStyle: {
            color: "#f83f37",
            opacity: 1,
          },
        },
      ],
    };
    eChart_4.setOption(option4);
    eChart_4.resize();
  }

  $.ajax({
    url: `${baseUrl}/membershipAcess`,
    type: "GET",
    contentType: "application/json",
    success: function (response) {
      console.log(response);

      var xLabels = response.map((data) => {
        return data.label;
      });

      console.log(xLabels);
      var yValues = response.map((data) => {
        return data.quantity;
      });

      if ($("#e_chart_5").length > 0) {
        var eChart_5 = echarts.init(document.getElementById("e_chart_5"));
        var option5 = {
          color: ["#ab26aa"],
          tooltip: {
            show: true,
            trigger: "axis",
            backgroundColor: "#fff",
            borderRadius: 6,
            padding: 6,
            axisPointer: {
              lineStyle: {
                width: 0,
              },
            },
            textStyle: {
              color: "#324148",
              fontFamily:
                '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
              fontSize: 12,
            },
          },

          grid: {
            top: "3%",
            left: "3%",
            right: "3%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: [
            {
              type: "category",
              data: xLabels,
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: "#5e7d8a",
                },
                interval: 0,
                rotate: 20,
              },
            },
          ],
          yAxis: [
            {
              type: "value",
              axisLine: {
                show: false,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                textStyle: {
                  color: "#5e7d8a",
                },
              },
              splitLine: {
                lineStyle: {
                  color: "#eaecec",
                },
              },
            },
          ],
          series: [
            {
              name: "members",
              type: "bar",
              selectedMode: "single",
              barMaxWidth: 40,
              data: yValues,
            },
          ],
        };

        eChart_5.setOption(option5);
        eChart_5.resize();
      }
    },
  });

  if ($("#e_chart_9").length > 0) {
    var eChart_9 = echarts.init(document.getElementById("e_chart_9"));
    var option8 = {
      color: ["#00acf0", "#22af47"],
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        borderRadius: 6,
        padding: 6,
        axisPointer: {
          lineStyle: {
            width: 0,
          },
        },
        textStyle: {
          color: "#324148",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
          fontSize: 12,
        },
      },
      grid: {
        top: "3%",
        left: "3%",
        right: "3%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            textStyle: {
              color: "#5e7d8a",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#eaecec",
            },
          },
        },
      ],
      yAxis: {
        type: "category",
        data: [
          "Mon",
          "Tue",
          "Wed",
          "Thu",
          "Fri",
          "Sat",
          "Sun",
          "Mon",
          "Tue",
          "Wed",
          "Thu",
        ],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#5e7d8a",
          },
        },
      },
      series: [
        {
          name: "1",
          type: "bar",
          stack: "st1",
          barMaxWidth: 7.5,
          data: [320, 332, 301, 334, 390, 330, 320, 334, 390, 330, 320],
        },
        {
          name: "2",
          type: "bar",
          stack: "st1",
          barMaxWidth: 7.5,
          data: [
            -120, -132, -101, -134, -90, -230, -210, -134, -90, -230, -210,
          ],
        },
      ],
    };
    eChart_9.setOption(option8);
    eChart_9.resize();
  }

  if ($("#e_chart_10").length > 0) {
    var eChart_10 = echarts.init(document.getElementById("e_chart_10"));

    var option9 = {
      tooltip: {
        show: true,
        backgroundColor: "#fff",
        borderRadius: 6,
        padding: 6,
        axisPointer: {
          lineStyle: {
            width: 0,
          },
        },
        textStyle: {
          color: "#324148",
          fontFamily:
            '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
          fontSize: 12,
        },
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["40%", "50%"],
          color: ["#00acf0", "#ffbf36", "#f83f37", "#22af47"],
          data: [
            { value: 435, name: "" },
            { value: 679, name: "" },
            { value: 848, name: "" },
            { value: 348, name: "" },
          ],
          label: {
            normal: {
              formatter: "{b}\n{d}%",
            },
          },
        },
      ],
    };
    eChart_10.setOption(option9);
    eChart_10.resize();
  }
};
/*****E-Charts function end*****/

/*****Resize function start*****/
var echartResize;
$(window)
  .on("resize", function () {
    /*E-Chart Resize*/
    clearTimeout(echartResize);
    echartResize = setTimeout(echartsConfig, 200);
  })
  .resize();
/*****Resize function end*****/

/*****Function Call start*****/
echartsConfig();
/*****Function Call end*****/
