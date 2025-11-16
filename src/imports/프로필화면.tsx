import svgPaths from "./svg-4v8euld3u3";

function Heading() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">프로필</p>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_12_3988)" id="Icon">
          <path d="M10 5V10L13.3333 11.6667" id="Vector" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p14d24500} id="Vector_2" stroke="var(--stroke-0, #9810FA)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
        <defs>
          <clipPath id="clip0_12_3988">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="bg-purple-100 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon />
      </div>
    </div>
  );
}

function Text() {
  return (
    <div className="h-[24px] relative shrink-0 w-[91.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[91.25px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">총 학습 시간</p>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[307.328px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-full items-center relative w-[307.328px]">
        <Container />
        <Text />
      </div>
    </div>
  );
}

function ProfilePage1() {
  return (
    <div className="h-[36px] relative shrink-0 w-[307.328px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[307.328px]">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 top-[-3px] w-[121px]">10h 30m</p>
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-purple-100 box-border content-stretch flex flex-col gap-[32px] h-[158px] items-start left-0 pl-[25px] pr-px py-[25px] rounded-[14px] top-0 w-[357.328px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProfilePage />
      <ProfilePage1 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #155DFC)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-blue-100 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[91.25px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[91.25px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">이번 주 학습</p>
      </div>
    </div>
  );
}

function ProfilePage2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[307.328px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-full items-center relative w-[307.328px]">
        <Container1 />
        <Text1 />
      </div>
    </div>
  );
}

function ProfilePage3() {
  return (
    <div className="h-[36px] relative shrink-0 w-[307.328px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[307.328px]">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 top-[-3px] w-[121px]">10h 30m</p>
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="absolute bg-blue-100 box-border content-stretch flex flex-col gap-[32px] h-[158px] items-start left-[381.33px] pl-[25px] pr-px py-[25px] rounded-[14px] top-0 w-[357.328px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProfilePage2 />
      <ProfilePage3 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p3ac0b600} id="Vector" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p3c797180} id="Vector_2" stroke="var(--stroke-0, #00A63E)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div className="bg-green-100 relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex items-center justify-center relative size-[40px]">
        <Icon2 />
      </div>
    </div>
  );
}

function Text2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.625px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[69.625px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">평균 세션</p>
      </div>
    </div>
  );
}

function ProfilePage4() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[307.344px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[12px] h-full items-center relative w-[307.344px]">
        <Container2 />
        <Text2 />
      </div>
    </div>
  );
}

function ProfilePage5() {
  return (
    <div className="h-[36px] relative shrink-0 w-[307.344px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[307.344px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[36px] left-0 text-[30px] text-neutral-950 top-[-3px] w-[80px]">126분</p>
      </div>
    </div>
  );
}

function Card2() {
  return (
    <div className="absolute bg-green-100 box-border content-stretch flex flex-col gap-[32px] h-[158px] items-start left-[762.66px] pl-[25px] pr-px py-[25px] rounded-[14px] top-0 w-[357.344px]" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProfilePage4 />
      <ProfilePage5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[158px] relative shrink-0 w-full" data-name="Container">
      <Card />
      <Card1 />
      <Card2 />
    </div>
  );
}

function ProfilePage6() {
  return (
    <div className="absolute h-[24px] left-[25px] top-[25px] w-[1070px]" data-name="ProfilePage">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">이번 주 과목별 학습 시간</p>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[1.67%_0.47%_19.67%_6.08%]" data-name="Group">
      <div className="absolute bottom-[-0.21%] left-0 right-0 top-[-0.21%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 237">
          <g id="Group">
            <path d="M0 236.5H1000" id="Vector" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M0 177.5H1000" id="Vector_2" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M0 118.5H1000" id="Vector_3" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M0 59.5H1000" id="Vector_4" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M0 0.5H1000" id="Vector_5" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[1.67%_0.47%_19.67%_6.08%]" data-name="Group">
      <div className="absolute bottom-0 left-[-0.05%] right-[-0.05%] top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1001 236">
          <g id="Group">
            <path d="M125.5 0V236" id="Vector" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M375.5 0V236" id="Vector_2" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M625.5 0V236" id="Vector_3" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M875.5 0V236" id="Vector_4" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M0.5 0V236" id="Vector_5" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
            <path d="M1000.5 0V236" id="Vector_6" stroke="var(--stroke-0, #CCCCCC)" strokeDasharray="3 3" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents inset-[1.67%_0.47%_19.67%_6.08%]" data-name="Group">
      <Group />
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents inset-[80.33%_80.14%_13.16%_15.65%]" data-name="Group">
      <div className="absolute inset-[80.33%_82.24%_17.67%_17.76%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[81.84%_80.14%_13.16%_15.65%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">자료구조</p>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents inset-[80.33%_56.78%_13.16%_39.02%]" data-name="Group">
      <div className="absolute inset-[80.33%_58.88%_17.67%_41.12%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[81.84%_56.78%_13.16%_39.02%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">알고리즘</p>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents inset-[80.33%_33.41%_13.16%_62.38%]" data-name="Group">
      <div className="absolute inset-[80.33%_35.51%_17.67%_64.49%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[81.84%_33.41%_13.16%_62.38%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">운영체제</p>
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents inset-[80.33%_9.02%_13.16%_84.72%]" data-name="Group">
      <div className="absolute inset-[80.33%_12.15%_17.67%_87.85%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 6">
            <path d="M0.5 6V0" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal inset-[81.84%_9.02%_13.16%_84.72%] leading-[normal] not-italic text-[#666666] text-[12px] text-center text-nowrap whitespace-pre">데이터베이스</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents inset-[80.33%_9.02%_13.16%_15.65%]" data-name="Group">
      <Group3 />
      <Group4 />
      <Group5 />
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents inset-[80.33%_0.47%_13.16%_6.08%]" data-name="Group">
      <div className="absolute inset-[80.33%_0.47%_19.67%_6.08%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1000 1">
            <path d="M0 0.5H1000" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <Group7 />
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents inset-[77.75%_93.92%_17.25%_4.58%]" data-name="Group">
      <div className="absolute inset-[80.33%_93.92%_19.67%_5.51%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[77.75%_94.67%_17.25%_4.58%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">0</p>
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents inset-[58.09%_93.92%_36.91%_3.92%]" data-name="Group">
      <div className="absolute inset-[60.67%_93.92%_39.33%_5.51%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[58.09%_94.67%_36.91%_3.92%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">75</p>
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents inset-[38.42%_93.92%_56.58%_3.36%]" data-name="Group">
      <div className="absolute inset-[41%_93.92%_59%_5.51%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[38.42%_94.67%_56.58%_3.36%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">150</p>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents inset-[18.75%_93.92%_76.25%_3.27%]" data-name="Group">
      <div className="absolute inset-[21.33%_93.92%_78.67%_5.51%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[18.75%_94.67%_76.25%_3.27%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">225</p>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute contents inset-[1.42%_93.92%_93.58%_3.18%]" data-name="Group">
      <div className="absolute inset-[1.67%_93.92%_98.33%_5.51%]" data-name="Vector">
        <div className="absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 1">
            <path d="M0 0.5H6" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal inset-[1.42%_94.67%_93.58%_3.18%] leading-[normal] not-italic text-[#666666] text-[12px] text-nowrap text-right whitespace-pre">300</p>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[1.42%_93.92%_17.25%_3.18%]" data-name="Group">
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
      <Group13 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents inset-[1.42%_93.92%_17.25%_3.18%]" data-name="Group">
      <div className="absolute inset-[1.67%_93.92%_19.67%_6.08%]" data-name="Vector">
        <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 236">
            <path d="M0.5 0V236" id="Vector" stroke="var(--stroke-0, #666666)" />
          </svg>
        </div>
      </div>
      <Group14 />
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute inset-[1.67%_82.43%_19.67%_8.41%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 236">
        <g id="Group">
          <path d="M0 0H98V236H0V0Z" fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute inset-[48.87%_59.06%_19.67%_31.78%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 95">
        <g id="Group">
          <path d="M0 0H98V94.4H0V0Z" fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute inset-[48.87%_35.7%_19.67%_55.14%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 95">
        <g id="Group">
          <path d="M0 0H98V94.4H0V0Z" fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute inset-[56.73%_12.34%_19.67%_78.5%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 71">
        <g id="Group">
          <path d="M0 0H98V70.8H0V0Z" fill="var(--fill-0, #9810FA)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents inset-[1.67%_12.34%_19.67%_8.41%]" data-name="Group">
      <Group16 />
      <Group17 />
      <Group18 />
      <Group19 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute contents inset-[1.67%_12.34%_19.67%_8.41%]" data-name="Group">
      <Group20 />
    </div>
  );
}

function RechartsBarR() {
  return (
    <div className="absolute contents inset-[1.67%_12.34%_19.67%_8.41%]" data-name="recharts-bar-:r5:">
      <Group21 />
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute inset-[1.67%_72.9%_19.67%_17.94%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 236">
        <g id="Group">
          <path d="M0 0H98V236H0V0Z" fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute inset-[17.4%_49.53%_19.67%_41.31%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 189">
        <g id="Group">
          <path d="M0 0H98V188.8H0V0Z" fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute inset-[33.13%_26.17%_19.67%_64.67%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 142">
        <g id="Group">
          <path d="M0 0H98V141.6H0V0Z" fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute inset-[27.89%_2.8%_19.67%_88.04%]" data-name="Group">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 98 158">
        <g id="Group">
          <path d="M0 0H98V157.333H0V0Z" fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents inset-[1.67%_2.8%_19.67%_17.94%]" data-name="Group">
      <Group22 />
      <Group23 />
      <Group24 />
      <Group25 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents inset-[1.67%_2.8%_19.67%_17.94%]" data-name="Group">
      <Group26 />
    </div>
  );
}

function RechartsBarR1() {
  return (
    <div className="absolute contents inset-[1.67%_2.8%_19.67%_17.94%]" data-name="recharts-bar-:r6:">
      <Group27 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="absolute h-[300px] left-0 overflow-clip top-0 w-[1070px]" data-name="Icon">
      <Group2 />
      <Group8 />
      <Group15 />
      <RechartsBarR />
      <RechartsBarR1 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="absolute left-0 size-[14px] top-[6.89px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #D1D5DB)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-[18px] top-px w-[63.375px]" data-name="Text">
      <p className="basis-0 font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-center text-gray-300">목표 (분)</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="absolute h-[24px] left-[419.81px] top-0 w-[81.375px]" data-name="List Item">
      <Icon4 />
      <Text3 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="absolute left-0 size-[14px] top-[6.89px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M0 1.75H14V12.25H0V1.75Z" fill="var(--fill-0, #8B5CF6)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute content-stretch flex h-[21px] items-start left-[18px] top-px w-[101px]" data-name="Text">
      <p className="basis-0 font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal grow leading-[24px] min-h-px min-w-px relative shrink-0 text-[16px] text-center text-violet-500">학습 시간 (분)</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="absolute h-[24px] left-[511.19px] top-0 w-[119px]" data-name="List Item">
      <Icon5 />
      <Text4 />
    </div>
  );
}

function Legend() {
  return (
    <div className="absolute h-[24px] left-[5px] top-[271px] w-[1060px]" data-name="Legend">
      <ListItem />
      <ListItem1 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute h-[300px] left-[25px] top-[89px] w-[1070px]" data-name="Container">
      <Icon3 />
      <Legend />
    </div>
  );
}

function Card3() {
  return (
    <div className="bg-white h-[414px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <ProfilePage6 />
      <Container4 />
    </div>
  );
}

function ProfilePage7() {
  return (
    <div className="h-[24px] relative shrink-0 w-[498px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[498px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">과목별 진행 상황</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-blue-500 relative rounded-[33554400px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[12px]" />
    </div>
  );
}

function Text5() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">자료구조</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[76px]">
        <Container5 />
        <Text5 />
      </div>
    </div>
  );
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[65.828px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-1px] w-[66px]">300/300분</p>
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container6 />
      <Text6 />
    </div>
  );
}

function Container8() {
  return <div className="bg-blue-500 h-[8px] rounded-[33554400px] shrink-0 w-full" data-name="Container" />;
}

function Container9() {
  return (
    <div className="bg-gray-200 content-stretch flex flex-col h-[8px] items-start overflow-clip relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <Container8 />
    </div>
  );
}

function Container10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Container7 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="bg-emerald-500 relative rounded-[33554400px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[12px]" />
    </div>
  );
}

function Text7() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">알고리즘</p>
      </div>
    </div>
  );
}

function Container12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[76px]">
        <Container11 />
        <Text7 />
      </div>
    </div>
  );
}

function Text8() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[65.828px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-1px] w-[66px]">120/240분</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Text8 />
    </div>
  );
}

function Container14() {
  return <div className="bg-emerald-500 h-[8px] rounded-[33554400px] shrink-0 w-full" data-name="Container" />;
}

function Container15() {
  return (
    <div className="bg-gray-200 h-[8px] relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col h-[8px] items-start pl-0 pr-[249px] py-0 relative w-full">
          <Container14 />
        </div>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Container13 />
      <Container15 />
    </div>
  );
}

function Container17() {
  return (
    <div className="bg-amber-500 relative rounded-[33554400px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[12px]" />
    </div>
  );
}

function Text9() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">운영체제</p>
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="h-[20px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[76px]">
        <Container17 />
        <Text9 />
      </div>
    </div>
  );
}

function Text10() {
  return (
    <div className="h-[20px] relative shrink-0 w-[65.828px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[65.828px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-1px] w-[66px]">120/180분</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container18 />
      <Text10 />
    </div>
  );
}

function Container20() {
  return <div className="bg-amber-500 h-[8px] rounded-[33554400px] shrink-0 w-full" data-name="Container" />;
}

function Container21() {
  return (
    <div className="bg-gray-200 h-[8px] relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col h-[8px] items-start pl-0 pr-[166px] py-0 relative w-full">
          <Container20 />
        </div>
      </div>
    </div>
  );
}

function Container22() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Container19 />
      <Container21 />
    </div>
  );
}

function Container23() {
  return (
    <div className="bg-violet-500 relative rounded-[33554400px] shrink-0 size-[12px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[12px]" />
    </div>
  );
}

function Text11() {
  return (
    <div className="basis-0 grow h-[20px] min-h-px min-w-px relative shrink-0" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">데이터베이스</p>
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[20px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[20px] items-center relative w-[104px]">
        <Container23 />
        <Text11 />
      </div>
    </div>
  );
}

function Text12() {
  return (
    <div className="h-[20px] relative shrink-0 w-[58.109px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[20px] relative w-[58.109px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-0 text-[#4a5565] text-[14px] top-[-1px] w-[59px]">90/200분</p>
      </div>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex h-[20px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Text12 />
    </div>
  );
}

function Container26() {
  return <div className="bg-violet-500 h-[8px] rounded-[33554400px] shrink-0 w-full" data-name="Container" />;
}

function Container27() {
  return (
    <div className="bg-gray-200 h-[8px] relative rounded-[33554400px] shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex flex-col h-[8px] items-start pl-0 pr-[273.906px] py-0 relative w-full">
          <Container26 />
        </div>
      </div>
    </div>
  );
}

function Container28() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[36px] items-start relative shrink-0 w-full" data-name="Container">
      <Container25 />
      <Container27 />
    </div>
  );
}

function ProfilePage8() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[498px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[16px] h-full items-start relative w-[498px]">
        <Container10 />
        <Container16 />
        <Container22 />
        <Container28 />
      </div>
    </div>
  );
}

function Card4() {
  return (
    <div className="bg-white col-end-auto col-start-1 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] items-start pl-[25px] pr-px py-[25px] relative size-full">
          <ProfilePage7 />
          <ProfilePage8 />
        </div>
      </div>
    </div>
  );
}

function ProfilePage9() {
  return (
    <div className="h-[24px] relative shrink-0 w-[498px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[24px] relative w-[498px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">리포트</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[8px] h-[36px] items-center left-0 px-[17px] py-[9px] rounded-[8px] top-[-7px] w-[498px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="basis-0 font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[14px] text-neutral-950">📊 주간 리포트 보기</p>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Link">
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex gap-[8px] h-[36px] items-center left-0 px-[17px] py-[9px] rounded-[8px] top-[-7px] w-[498px]" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="basis-0 font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[14px] text-neutral-950">📅 일간 리포트 보기</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Link">
      <Button1 />
    </div>
  );
}

function ProfilePage10() {
  return (
    <div className="h-[72px] relative shrink-0 w-[498px]" data-name="ProfilePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[15px] h-[72px] items-start pb-0 pt-[7px] px-0 relative w-[498px]">
        <Link />
        <Link1 />
      </div>
    </div>
  );
}

function Card5() {
  return (
    <div className="bg-white col-end-auto col-start-2 relative rounded-[14px] row-end-auto row-start-1 shrink-0" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] items-start pb-px pl-[25px] pr-px pt-[25px] relative size-full">
          <ProfilePage9 />
          <ProfilePage10 />
        </div>
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="gap-[24px] grid grid-cols-[repeat(2,_minmax(0px,_1fr))] grid-rows-[repeat(1,_minmax(0px,_1fr))] h-[306px] relative shrink-0 w-full" data-name="Container">
      <Card4 />
      <Card5 />
    </div>
  );
}

function ProfilePage11() {
  return (
    <div className="absolute bg-gray-50 box-border content-stretch flex flex-col gap-[32px] h-[1062px] items-start left-[192px] pb-0 pt-[32px] px-[16px] top-[65px] w-[1152px]" data-name="ProfilePage">
      <Heading />
      <Container3 />
      <Card3 />
      <Container29 />
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute h-[24px] left-0 top-[-20000px] w-[8.813px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">0</p>
    </div>
  );
}

function Icon6() {
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

function Link2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[118.813px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[24px] items-center relative w-[118.813px]">
        <Icon6 />
        <Navbar />
      </div>
    </div>
  );
}

function Icon7() {
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

function Button2() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <Icon7 />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">김학생</p>
    </div>
  );
}

function Link3() {
  return (
    <button className="cursor-pointer h-[32px] relative shrink-0 w-[92px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[32px] items-start relative w-[92px]">
        <Button2 />
      </div>
    </button>
  );
}

function Icon8() {
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

function Button3() {
  return (
    <div className="basis-0 grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon8 />
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">로그아웃</p>
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[32px] relative shrink-0 w-[214px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[32px] items-center relative w-[214px]">
        <Link3 />
        <Button3 />
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[16px] py-0 relative w-full">
          <Link2 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function Navbar1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1536px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Container31 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="프로필 화면">
      <ProfilePage11 />
      <Text13 />
      <Navbar1 />
    </div>
  );
}