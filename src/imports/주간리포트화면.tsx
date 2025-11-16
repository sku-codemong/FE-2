import svgPaths from "./svg-cjftd2lf6u";

function Text() {
  return (
    <div className="absolute h-[24px] left-0 top-[-20000px] w-[8.813px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">0</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p36c5af80} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M18 17V9" id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 17V5" id="Vector_3" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M8 17V14" id="Vector_4" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Navbar() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Navbar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#9810fa] text-[16px] text-nowrap top-[-2px] whitespace-pre">Study Timer</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[24px] relative shrink-0 w-[118.813px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[24px] items-center relative w-[118.813px]">
        <Icon />
        <Navbar />
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p399eca00} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.pc93b400} id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <Icon1 />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">김학생</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[92px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[32px] items-start relative w-[92px]">
        <Button />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[10px] size-[16px] top-[8px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2c1f680} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14 8H6" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p12257fa0} id="Vector_3" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="basis-0 grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon2 />
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">로그아웃</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[32px] relative shrink-0 w-[214px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[32px] items-center relative w-[214px]">
        <Link1 />
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[16px] py-0 relative w-full">
          <Link />
          <Container />
        </div>
      </div>
    </div>
  );
}

function Navbar1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-0 px-[7.5px] top-0 w-[1551px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Container1 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p203476e0} id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M12.6667 8H3.33333" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <button className="absolute block cursor-pointer h-[36px] left-[24px] overflow-visible rounded-[8px] top-[24px] w-[112px]" data-name="Button">
      <Icon3 />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[44px] text-[14px] text-neutral-950 text-nowrap top-[7px] whitespace-pre">돌아가기</p>
    </button>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[36px] left-0 text-[24px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">주간 학습 리포트</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">2024년 11월 3일 - 11월 9일</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[68px] relative shrink-0 w-[202.813px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[8px] h-[68px] items-start relative w-[202.813px]">
        <Heading />
        <Paragraph />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="Icon">
          <path d="M10.6667 2.66667V8" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M21.3333 2.66667V8" id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d={svgPaths.p8d31b00} id="Vector_3" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
          <path d="M4 13.3333H28" id="Vector_4" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex h-[68px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Icon4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_14_540)" id="Icon">
          <path d={svgPaths.p14d24500} id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p240d7000} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p25499600} id="Vector_3" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_14_540">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[91.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[91.25px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">총 학습 시간</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon5 />
      <Text1 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 top-[-2px] w-[89px]">15시간 20분</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-purple-50 col-end-auto col-start-1 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">
          <Container4 />
          <Paragraph1 />
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3ac0b600} id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c797180} id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[69.625px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">일일 평균</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon6 />
      <Text2 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">2시간 10분</p>
    </div>
  );
}

function Container7() {
  return (
    <div className="bg-blue-50 col-end-auto col-start-2 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">
          <Container6 />
          <Paragraph2 />
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p271be980} id="Vector" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p809b580} id="Vector_2" stroke="var(--stroke-0, #009966)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[85.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[85.625px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">목표 달성률</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon7 />
      <Text3 />
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">85%</p>
    </div>
  );
}

function Container9() {
  return (
    <div className="bg-emerald-50 col-end-auto col-start-3 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">
          <Container8 />
          <Paragraph3 />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #E17100)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[48px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[48px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">학습일</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex gap-[8px] h-[24px] items-center relative shrink-0 w-full" data-name="Container">
      <Icon8 />
      <Text4 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">7일 / 7일</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-amber-50 col-end-auto col-start-4 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[8px] items-start pb-0 pt-[16px] px-[16px] relative size-full">
          <Container10 />
          <Paragraph4 />
        </div>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="gap-[16px] grid grid-cols-[repeat(4,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[88px] relative shrink-0 w-full" data-name="Container">
      <Container5 />
      <Container7 />
      <Container9 />
      <Container11 />
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] h-[244px] items-start left-[24px] pb-0 pt-[32px] px-[32px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[76px] w-[1104px]" data-name="Container">
      <Container3 />
      <Container12 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[30px] left-0 text-[20px] text-neutral-950 text-nowrap top-[-3px] whitespace-pre">일별 학습 시간</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[1.67%_0.48%_11.67%_6.25%]" data-name="Group">
      <div className="absolute bottom-[-0.19%] left-0 right-0 top-[-0.19%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 970 261">
          <g id="Group">
            <path d="M0 260.5H970" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 195.5H970" id="Vector_2" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 130.5H970" id="Vector_3" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 65.5H970" id="Vector_4" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0 0.5H970" id="Vector_5" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[1.67%_0.48%_11.67%_6.25%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.05%] right-[-0.05%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 971 260">
          <g id="Group">
            <path d="M69.7857 0V260" id="Vector" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M208.357 0V260" id="Vector_2" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M346.929 0V260" id="Vector_3" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M485.5 0V260" id="Vector_4" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M624.071 0V260" id="Vector_5" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M762.643 0V260" id="Vector_6" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M901.214 0V260" id="Vector_7" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M0.5 0V260" id="Vector_8" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
            <path d="M970.5 0V260" id="Vector_9" stroke="var(--stroke-0, #E5E7EB)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[1.67%_0.48%_11.67%_6.25%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[88.33%_86.51%_5.16%_12.34%]" data-name="Group">
      <div className="absolute inset-[88.33%_87.09%_9.67%_12.91%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_86.51%_5.16%_12.34%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">월</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[88.33%_73.19%_5.16%_25.66%]" data-name="Group">
      <div className="absolute inset-[88.33%_73.76%_9.67%_26.24%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_73.19%_5.16%_25.66%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">화</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[88.33%_59.86%_5.16%_38.98%]" data-name="Group">
      <div className="absolute inset-[88.33%_60.44%_9.67%_39.56%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_59.86%_5.16%_38.98%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">수</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[88.33%_46.54%_5.16%_52.31%]" data-name="Group">
      <div className="absolute inset-[88.33%_47.12%_9.67%_52.88%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_46.54%_5.16%_52.31%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">목</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[88.33%_33.21%_5.16%_65.63%]" data-name="Group">
      <div className="absolute inset-[88.33%_33.79%_9.67%_66.21%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_33.21%_5.16%_65.63%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">금</p>
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[88.33%_19.89%_5.16%_78.96%]" data-name="Group">
      <div className="absolute inset-[88.33%_20.47%_9.67%_79.53%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_19.89%_5.16%_78.96%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">토</p>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[88.33%_6.57%_5.16%_92.28%]" data-name="Group">
      <div className="absolute inset-[88.33%_7.14%_9.67%_92.86%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[89.84%_6.57%_5.16%_92.28%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-center text-nowrap whitespace-pre">일</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[88.33%_6.57%_5.16%_12.34%]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
      <Group7 />
      <Group8 />
      <Group9 />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[88.33%_0.48%_5.16%_6.25%]" data-name="Group">
      <div className="absolute inset-[88.33%_0.48%_11.67%_6.25%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 970 1">
            <path d="M0 0.5H970" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <Group10 />
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[85.75%_93.75%_9.25%_4.71%]" data-name="Group">
      <div className="absolute inset-[88.33%_93.75%_11.67%_5.67%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[85.75%_94.52%_9.25%_4.71%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[64.09%_93.75%_30.91%_4.04%]" data-name="Group">
      <div className="absolute inset-[66.67%_93.75%_33.33%_5.67%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[64.09%_94.52%_30.91%_4.04%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-nowrap text-right whitespace-pre">50</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[42.42%_93.75%_52.58%_3.46%]" data-name="Group">
      <div className="absolute inset-[45%_93.75%_55%_5.67%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[42.42%_94.52%_52.58%_3.46%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-nowrap text-right whitespace-pre">100</p>
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[20.75%_93.75%_74.25%_3.46%]" data-name="Group">
      <div className="absolute inset-[23.33%_93.75%_76.67%_5.67%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[20.75%_94.52%_74.25%_3.46%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-nowrap text-right whitespace-pre">150</p>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents inset-[1.42%_93.75%_93.58%_3.27%]" data-name="Group">
      <div className="absolute inset-[1.67%_93.75%_98.33%_5.67%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[1.42%_94.52%_93.58%_3.27%] leading-[normal] not-italic text-[#6a7282] text-[12px] text-nowrap text-right whitespace-pre">200</p>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents inset-[1.42%_93.75%_9.25%_3.27%]" data-name="Group">
      <Group12 />
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents inset-[1.42%_93.75%_9.25%_0.22%]" data-name="Group">
      <div className="absolute inset-[1.67%_93.75%_11.67%_6.25%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 260">
            <path d="M0.5 0V260" id="Vector" stroke="var(--stroke-0, #6A7282)" />
          </svg>
        </div>
      </div>
      <Group17 />
      <div className="absolute flex inset-[41%_98.34%_55%_0.22%] items-center justify-center">
        <div className="flex-none h-[15px] rotate-[270deg] w-[12px]">
          <p className="font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] not-italic relative text-[12px] text-[grey] text-nowrap whitespace-pre">분</p>
        </div>
      </div>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute inset-[36.33%_81.84%_11.67%_7.58%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 156">
        <g id="Group">
          <path d={svgPaths.p26253f00} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute inset-[10.33%_68.52%_11.67%_20.91%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 234">
        <g id="Group">
          <path d={svgPaths.p1c137cf0} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute inset-[49.33%_55.19%_11.67%_34.23%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 117">
        <g id="Group">
          <path d={svgPaths.p4aeef80} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[23.33%_41.87%_11.67%_47.55%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 195">
        <g id="Group">
          <path d={svgPaths.p25f77200} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[1.67%_28.54%_11.67%_60.88%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 260">
        <g id="Group">
          <path d={svgPaths.p29a31300} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute inset-[45%_15.22%_11.67%_74.2%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 130">
        <g id="Group">
          <path d={svgPaths.p27d24c80} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[19%_1.9%_11.67%_87.53%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 110 208">
        <g id="Group">
          <path d={svgPaths.p1b83a080} fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents inset-[1.67%_1.9%_11.67%_7.58%]" data-name="Group">
      <Group19 />
      <Group20 />
      <Group21 />
      <Group22 />
      <Group23 />
      <Group24 />
      <Group25 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents inset-[1.67%_1.9%_11.67%_7.58%]" data-name="Group">
      <Group26 />
    </div>
  );
}

function RechartsBarR() {
  return (
    <div className="absolute contents inset-[1.67%_1.9%_11.67%_7.58%]" data-name="recharts-bar-:r4:">
      <Group27 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[1040px]" data-name="Icon">
      <Group2 />
      <Group11 />
      <Group18 />
      <RechartsBarR />
    </div>
  );
}

function Container14() {
  return (
    <div className="h-[300px] relative shrink-0 w-full" data-name="Container">
      <Icon9 />
    </div>
  );
}

function Container15() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] h-[418px] items-start left-[24px] pb-0 pt-[32px] px-[32px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[344px] w-[1104px]" data-name="Container">
      <Heading1 />
      <Container14 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="h-[30px] relative shrink-0 w-full" data-name="Heading 2">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[30px] left-0 text-[20px] text-neutral-950 text-nowrap top-[-3px] whitespace-pre">과목별 학습 시간 분포</p>
    </div>
  );
}

function Group28() {
  return (
    <div className="absolute bottom-1/2 left-[40.87%] right-[30.16%] top-[16.67%]" data-name="Group">
      <div className="absolute inset-[-0.5%_-0.34%_-0.5%_-0.46%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 148 101">
          <g id="Group">
            <path d={svgPaths.p1afde80} fill="var(--fill-0, #3B82F6)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group29() {
  return (
    <div className="absolute bottom-[32.68%] left-[30.16%] right-1/2 top-[20.4%]" data-name="Group">
      <div className="absolute inset-[-0.48%_-0.66%_-0.49%_-0.5%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 143">
          <g id="Group">
            <path d={svgPaths.p2f9a1f00} fill="var(--fill-0, #10B981)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group30() {
  return (
    <div className="absolute bottom-[16.67%] left-[33.05%] right-[45.96%] top-1/2" data-name="Group">
      <div className="absolute inset-[-0.8%_-0.56%_-0.5%_-0.65%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 108 102">
          <g id="Group">
            <path d={svgPaths.p2d62fb00} fill="var(--fill-0, #F59E0B)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group31() {
  return (
    <div className="absolute bottom-[17.36%] left-1/2 right-[30.16%] top-1/2" data-name="Group">
      <div className="absolute inset-[-0.51%_-0.5%_-0.6%_-0.61%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 99">
          <g id="Group">
            <path d={svgPaths.p7452300} fill="var(--fill-0, #8B5CF6)" id="Vector" stroke="var(--stroke-0, white)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group32() {
  return (
    <div className="absolute contents inset-[16.67%_30.16%]" data-name="Group">
      <Group28 />
      <Group29 />
      <Group30 />
      <Group31 />
    </div>
  );
}

function Group33() {
  return (
    <div className="absolute contents inset-[11.82%_23.14%_83.18%_62.37%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[11.82%_23.14%_83.18%_62.37%] leading-[normal] not-italic text-[12px] text-blue-500 text-nowrap whitespace-pre">자료구조 33%</p>
    </div>
  );
}

function Group34() {
  return (
    <div className="absolute contents inset-[35.21%_72.93%_59.79%_12.59%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[35.21%_72.93%_59.79%_12.59%] leading-[normal] not-italic text-[12px] text-emerald-500 text-nowrap text-right whitespace-pre">알고리즘 26%</p>
    </div>
  );
}

function Group35() {
  return (
    <div className="absolute contents inset-[82.69%_59.49%_12.31%_26.03%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[82.69%_59.49%_12.31%_26.03%] leading-[normal] not-italic text-[12px] text-amber-500 text-nowrap text-right whitespace-pre">운영체제 20%</p>
    </div>
  );
}

function Group36() {
  return (
    <div className="absolute contents inset-[71.24%_12.88%_23.76%_68.47%]" data-name="Group">
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[71.24%_12.88%_23.76%_68.47%] leading-[normal] not-italic text-[12px] text-nowrap text-violet-500 whitespace-pre">데이터베이스 22%</p>
    </div>
  );
}

function Group37() {
  return (
    <div className="absolute contents inset-[11.82%_12.88%_12.31%_12.59%]" data-name="Group">
      <Group33 />
      <Group34 />
      <Group35 />
      <Group36 />
    </div>
  );
}

function Group38() {
  return (
    <div className="absolute contents inset-[11.82%_12.88%_12.31%_12.59%]" data-name="Group">
      <Group32 />
      <Group37 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[504px]" data-name="Icon">
      <Group38 />
    </div>
  );
}

function Container16() {
  return (
    <div className="col-end-auto col-start-1 h-[300px] relative row-end-auto row-start-1 shrink-0" data-name="Container">
      <Icon10 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-blue-500 relative rounded-[33554400px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">자료구조</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[24px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[24px] items-center relative w-[92px]">
        <Container17 />
        <Text5 />
      </div>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[71.81px] text-[16px] text-neutral-950 text-right top-[-2px] translate-x-[-100%] w-[43px]">300분</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#6a7282] text-[16px] text-right top-[-2px] translate-x-[-100%] w-[72px]">5시간 0분</p>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[48px] relative shrink-0 w-[71.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[48px] items-start relative w-[71.25px]">
        <Paragraph5 />
        <Paragraph6 />
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="bg-gray-50 h-[80px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[80px] items-center justify-between px-[16px] py-0 relative w-full">
          <Container18 />
          <Container19 />
        </div>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="bg-emerald-500 relative rounded-[33554400px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text6() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">알고리즘</p>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="h-[24px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[24px] items-center relative w-[92px]">
        <Container21 />
        <Text6 />
      </div>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[71.81px] text-[16px] text-neutral-950 text-right top-[-2px] translate-x-[-100%] w-[43px]">240분</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#6a7282] text-[16px] text-right top-[-2px] translate-x-[-100%] w-[72px]">4시간 0분</p>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[48px] relative shrink-0 w-[71.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[48px] items-start relative w-[71.25px]">
        <Paragraph7 />
        <Paragraph8 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="bg-gray-50 h-[80px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[80px] items-center justify-between px-[16px] py-0 relative w-full">
          <Container22 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-amber-500 relative rounded-[33554400px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">운영체제</p>
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[24px] relative shrink-0 w-[92px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[24px] items-center relative w-[92px]">
        <Container25 />
        <Text7 />
      </div>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[71.81px] text-[16px] text-neutral-950 text-right top-[-2px] translate-x-[-100%] w-[43px]">180분</p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[72px] text-[#6a7282] text-[16px] text-right top-[-2px] translate-x-[-100%] w-[72px]">3시간 0분</p>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[48px] relative shrink-0 w-[71.25px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[48px] items-start relative w-[71.25px]">
        <Paragraph9 />
        <Paragraph10 />
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="bg-gray-50 h-[80px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[80px] items-center justify-between px-[16px] py-0 relative w-full">
          <Container26 />
          <Container27 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="bg-violet-500 relative rounded-[33554400px] shrink-0 size-[16px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function Text8() {
  return (
    <div className="basis-0 grow h-[24px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">데이터베이스</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[24px] relative shrink-0 w-[124px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-[24px] items-center relative w-[124px]">
        <Container29 />
        <Text8 />
      </div>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[80.63px] text-[16px] text-neutral-950 text-right top-[-2px] translate-x-[-100%] w-[43px]">200분</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[81px] text-[#6a7282] text-[16px] text-right top-[-2px] translate-x-[-100%] w-[81px]">3시간 20분</p>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[48px] relative shrink-0 w-[80.063px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[48px] items-start relative w-[80.063px]">
        <Paragraph11 />
        <Paragraph12 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="bg-gray-50 h-[80px] relative rounded-[14px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[80px] items-center justify-between px-[16px] py-0 relative w-full">
          <Container30 />
          <Container31 />
        </div>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="col-end-auto col-start-2 content-stretch flex flex-col gap-[16px] items-start relative row-end-auto row-start-1 shrink-0" data-name="Container">
      <Container20 />
      <Container24 />
      <Container28 />
      <Container32 />
    </div>
  );
}

function Container34() {
  return (
    <div className="gap-[32px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[368px] relative shrink-0 w-full" data-name="Container">
      <Container16 />
      <Container33 />
    </div>
  );
}

function Container35() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[24px] h-[486px] items-start left-[24px] pb-0 pt-[32px] px-[32px] rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] top-[786px] w-[1104px]" data-name="Container">
      <Heading2 />
      <Container34 />
    </div>
  );
}

function WeeklyReportScreen() {
  return (
    <div className="absolute bg-gray-50 h-[1296px] left-[200px] top-[65px] w-[1152px]" data-name="WeeklyReportScreen">
      <Button2 />
      <Container13 />
      <Container15 />
      <Container35 />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute bg-white h-[1361px] left-0 top-0 w-[1551px]" data-name="주간 리포트 화면">
      <Text />
      <Navbar1 />
      <WeeklyReportScreen />
    </div>
  );
}

export default function Component1() {
  return (
    <div className="relative size-full" data-name="주간 리포트 화면">
      <Component />
    </div>
  );
}