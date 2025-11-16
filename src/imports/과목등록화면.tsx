import svgPaths from "./svg-sdx3mokka3";

function Icon() {
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

function Button() {
  return (
    <button className="absolute block cursor-pointer h-[36px] left-[16px] overflow-visible rounded-[8px] top-[32px] w-[112px]" data-name="Button">
      <Icon />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[44px] text-[14px] text-neutral-950 text-nowrap top-[7px] whitespace-pre">돌아가기</p>
    </button>
  );
}

function Heading() {
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Heading 1">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[36px] left-0 text-[24px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">과목 일괄 추가</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-0 text-[#4a5565] text-[16px] text-nowrap top-[-2px] whitespace-pre">과목 정보를 입력하고 목표 시간을 자동으로 분배받으세요</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[68px] items-start left-[16px] top-[92px] w-[992px]" data-name="Container">
      <Heading />
      <Paragraph />
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="h-[14px] relative shrink-0 w-[942px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[14px] relative w-[942px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] left-0 text-[14px] text-neutral-950 text-nowrap top-[-1px] whitespace-pre">주당 사용 가능한 총 학습 시간 (시간)</p>
      </div>
    </div>
  );
}

function Input() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-[320px]" data-name="Input">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[36px] items-center overflow-clip px-[12px] py-[4px] relative rounded-[inherit] w-[320px]">
        <p className="font-['Arimo:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">20</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[12px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_12_4278)" id="Icon">
          <path d={svgPaths.p1a8ec300} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M13.3333 1.33333V4" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M14.6667 2.66667H12" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p22966600} id="Vector_4" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
        <defs>
          <clipPath id="clip0_12_4278">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#9810fa] h-[36px] relative rounded-[8px] shrink-0 w-[149.844px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[36px] relative w-[149.844px]">
        <Icon1 />
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[44px] text-[14px] text-nowrap text-white top-[7px] whitespace-pre">시간 자동 분배</p>
      </div>
    </div>
  );
}

function SubjectCreatePage() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[942px]" data-name="SubjectCreatePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-full items-center relative w-[942px]">
        <Input />
        <Button1 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="bg-gradient-to-r from-[#faf5ff] h-[132px] relative rounded-[14px] shrink-0 to-[#eff6ff] w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[32px] h-[132px] items-start pl-[25px] pr-px py-[25px] relative w-full">
          <PrimitiveLabel />
          <SubjectCreatePage />
        </div>
      </div>
    </div>
  );
}

function SubjectCreatePage1() {
  return (
    <div className="h-[27px] relative shrink-0 w-[52.25px]" data-name="SubjectCreatePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[27px] relative w-[52.25px]">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[27px] left-0 text-[#364153] text-[18px] top-[-2px] w-[53px]">과목 1</p>
      </div>
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">과목명</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="bg-[#f3f3f5] h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="box-border content-stretch flex h-[36px] items-center px-[12px] py-[4px] relative w-full">
          <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[14px] text-nowrap whitespace-pre">예: 자료구조</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[4px] h-[54px] items-start left-0 top-0 w-[942px]" data-name="Container">
      <PrimitiveLabel1 />
      <Input1 />
    </div>
  );
}

function PrimitiveLabel2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">학점</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[18px] text-[16px] text-neutral-950 top-[8px] w-[41px]">1학점</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[18px] text-[16px] text-neutral-950 top-[8px] w-[41px]">2학점</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="basis-0 bg-purple-50 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#9810fa] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[18px] text-[#9810fa] text-[16px] top-[8px] w-[41px]">3학점</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[24px] left-[18px] text-[16px] text-neutral-950 top-[8px] w-[41px]">4학점</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex gap-[8px] h-[44px] items-start relative shrink-0 w-full" data-name="Container">
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[66px] items-start left-0 top-[70px] w-[463px]" data-name="Container">
      <PrimitiveLabel2 />
      <Container2 />
    </div>
  );
}

function PrimitiveLabel3() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">난이도 (1: 쉬움 ~ 5: 어려움)</p>
    </div>
  );
}

function Button6() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[14px] text-[16px] text-neutral-950 text-nowrap top-[8px] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[14px] text-[16px] text-neutral-950 text-nowrap top-[8px] whitespace-pre">2</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="basis-0 bg-purple-50 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#9810fa] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[14px] text-[#9810fa] text-[16px] text-nowrap top-[8px] whitespace-pre">3</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[14px] text-[16px] text-neutral-950 text-nowrap top-[8px] whitespace-pre">4</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="basis-0 grow h-[44px] min-h-px min-w-px relative rounded-[10px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-gray-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[44px] relative w-full">
        <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-[14px] text-[16px] text-neutral-950 text-nowrap top-[8px] whitespace-pre">5</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="box-border content-stretch flex gap-[8px] h-[44px] items-start pl-0 py-0 relative shrink-0 w-full" data-name="Container">
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[66px] items-start left-[479px] top-[70px] w-[463px]" data-name="Container">
      <PrimitiveLabel3 />
      <Container4 />
    </div>
  );
}

function PrimitiveButton() {
  return (
    <div className="bg-[#f3f3f5] relative rounded-[4px] shrink-0 size-[16px]" data-name="Primitive.button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[4px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border size-[16px]" />
    </div>
  );
}

function PrimitiveLabel4() {
  return (
    <div className="h-[14px] relative shrink-0 w-[327.016px]" data-name="Primitive.label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[14px] items-center relative w-[327.016px]">
        <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">추가 과제나 프로젝트가 있습니다 (시간 배분 +30%)</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex gap-[8px] h-[16px] items-center left-0 top-[152px] w-[942px]" data-name="Container">
      <PrimitiveButton />
      <PrimitiveLabel4 />
    </div>
  );
}

function PrimitiveLabel5() {
  return (
    <div className="content-stretch flex gap-[8px] h-[14px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[14px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">과목 색상</p>
    </div>
  );
}

function Button11() {
  return <div className="absolute bg-blue-500 left-[-1.6px] rounded-[33554400px] shadow-[0px_0px_0px_2px_#ffffff,0px_0px_0px_4px_#99a1af] size-[35.2px] top-[-1.6px]" data-name="Button" />;
}

function Button12() {
  return <div className="absolute bg-emerald-500 left-[79.16px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button13() {
  return <div className="absolute bg-amber-500 left-[158.33px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button14() {
  return <div className="absolute bg-violet-500 left-[237.48px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button15() {
  return <div className="absolute bg-pink-500 left-[316.66px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button16() {
  return <div className="absolute bg-teal-500 left-[395.83px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button17() {
  return <div className="absolute bg-orange-500 left-[474.98px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button18() {
  return <div className="absolute bg-indigo-500 left-[554.16px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button19() {
  return <div className="absolute bg-red-500 left-[633.33px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button20() {
  return <div className="absolute bg-lime-500 left-[712.48px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button21() {
  return <div className="absolute bg-cyan-500 left-[791.66px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Button22() {
  return <div className="absolute bg-rose-500 left-[870.83px] rounded-[33554400px] size-[32px] top-0" data-name="Button" />;
}

function Container7() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Container">
      <Button11 />
      <Button12 />
      <Button13 />
      <Button14 />
      <Button15 />
      <Button16 />
      <Button17 />
      <Button18 />
      <Button19 />
      <Button20 />
      <Button21 />
      <Button22 />
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[54px] items-start left-0 top-[184px] w-[942px]" data-name="Container">
      <PrimitiveLabel5 />
      <Container7 />
    </div>
  );
}

function SubjectCreatePage2() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-[942px]" data-name="SubjectCreatePage">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-full relative w-[942px]">
        <Container1 />
        <Container3 />
        <Container5 />
        <Container6 />
        <Container8 />
      </div>
    </div>
  );
}

function Card1() {
  return (
    <div className="bg-white h-[355px] relative rounded-[14px] shrink-0 w-full" data-name="Card">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] h-[355px] items-start pl-[25px] pr-px py-[25px] relative w-full">
          <SubjectCreatePage1 />
          <SubjectCreatePage2 />
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="absolute left-[449.53px] size-[16px] top-[10px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M3.33333 8H12.6667" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 3.33333V12.6667" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button23() {
  return (
    <div className="bg-white h-[36px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon2 />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[481.53px] text-[14px] text-neutral-950 text-nowrap top-[7px] whitespace-pre">과목 추가</p>
    </div>
  );
}

function Button24() {
  return (
    <button className="basis-0 bg-white cursor-pointer grow h-[36px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[17px] py-[9px] relative w-full">
          <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-neutral-950 text-nowrap whitespace-pre">취소</p>
        </div>
      </div>
    </button>
  );
}

function Button25() {
  return (
    <div className="basis-0 bg-[#9810fa] grow h-[36px] min-h-px min-w-px opacity-50 relative rounded-[8px] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[8px] h-[36px] items-center justify-center px-[16px] py-[8px] relative w-full">
          <p className="font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">1개 과목 추가</p>
        </div>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="box-border content-stretch flex gap-[12px] h-[52px] items-start pb-0 pt-[16px] px-0 relative shrink-0 w-full" data-name="Container">
      <Button24 />
      <Button25 />
    </div>
  );
}

function Form() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[24px] h-[647px] items-start left-[16px] top-[192px] w-[992px]" data-name="Form">
      <Card />
      <Card1 />
      <Button23 />
      <Container9 />
    </div>
  );
}

function SubjectCreatePage3() {
  return (
    <div className="absolute bg-gray-50 h-[871px] left-[256px] top-[65px] w-[1024px]" data-name="SubjectCreatePage">
      <Button />
      <Container />
      <Form />
    </div>
  );
}

function T() {
  return <div className="absolute left-[281px] opacity-0 size-[16px] top-[657px]" data-name="T21" />;
}

function Text() {
  return (
    <div className="absolute h-[24px] left-0 top-[-20000px] w-[8.813px]" data-name="Text">
      <p className="absolute font-['Arimo:Regular',sans-serif] font-normal leading-[24px] left-0 text-[16px] text-neutral-950 text-nowrap top-[-2px] whitespace-pre">0</p>
    </div>
  );
}

function Icon3() {
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
        <Icon3 />
        <Navbar />
      </div>
    </div>
  );
}

function Icon4() {
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

function Button26() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Button">
      <Icon4 />
      <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">김학생</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[32px] relative shrink-0 w-[92px]" data-name="Link">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col h-[32px] items-start relative w-[92px]">
        <Button26 />
      </div>
    </div>
  );
}

function Icon5() {
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

function Button27() {
  return (
    <div className="basis-0 grow h-[32px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[32px] relative w-full">
        <Icon5 />
        <p className="absolute font-['Arimo:Regular','Noto_Sans_KR:Regular',sans-serif] font-normal leading-[20px] left-[40px] text-[14px] text-neutral-950 text-nowrap top-[5px] whitespace-pre">로그아웃</p>
      </div>
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[32px] relative shrink-0 w-[214px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[16px] h-[32px] items-center relative w-[214px]">
        <Link1 />
        <Button27 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="h-[64px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="box-border content-stretch flex h-[64px] items-center justify-between px-[16px] py-0 relative w-full">
          <Link />
          <Container10 />
        </div>
      </div>
    </div>
  );
}

function Navbar1() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col h-[65px] items-start left-0 pb-px pt-0 px-0 top-0 w-[1536px]" data-name="Navbar">
      <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none" />
      <Container11 />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-white relative size-full" data-name="과목 등록 화면">
      <SubjectCreatePage3 />
      <T />
      <Text />
      <Navbar1 />
    </div>
  );
}