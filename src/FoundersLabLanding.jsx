import React, { useState, useEffect } from 'react';

const FoundersLabLanding = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job: '',
    years: '',
    hasIdea: '',
    ideaDesc: '',
    goal: '',
    heardFrom: [],
    agreePrivacy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // D-day 계산 (마감일: 2026년 6월 30일 23:59:59)
  useEffect(() => {
    const calculateDaysLeft = () => {
      const deadline = new Date('2026-06-30T23:59:59+09:00');
      const now = new Date();
      const diff = deadline - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };

    calculateDaysLeft();
    const interval = setInterval(calculateDaysLeft, 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'heardFrom') {
      setFormData(prev => ({
        ...prev,
        heardFrom: checked
          ? [...prev.heardFrom, value]
          : prev.heardFrom.filter(v => v !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // 구글 시트 연동 (Google Apps Script Web App URL 필요)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!formData.agreePrivacy) {
      alert('개인정보 수집 및 이용에 동의해주세요.');
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.email || !formData.job || !formData.years || !formData.hasIdea || !formData.goal) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = {
        timestamp: new Date().toISOString(),
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        job: formData.job,
        years: formData.years,
        hasIdea: formData.hasIdea,
        ideaDesc: formData.ideaDesc || '',
        goal: formData.goal,
        heardFrom: formData.heardFrom.join(', ') || ''
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error('서버 오류');

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('Submit error:', error);
      setIsSubmitting(false);
      setSubmitError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 신청 섹션으로 스크롤
  const scrollToApply = (e) => {
    e.preventDefault();
    const applySection = document.getElementById('apply');
    if (applySection) {
      applySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const faqs = [
    { q: "아직 아이디어가 없어도 참가할 수 있나요?", a: "가능합니다. 1주차 오프라인 인트로세션에서 \"내가 뭘 하려고 하는지\" 방향을 잡는 것부터 시작합니다. 1기 운영 경험상, 아이디어가 없는 상태에서 시작해도 인트로세션과 초반 과제를 통해 자연스럽게 정리되는 경우가 많았습니다." },
    { q: "직장 다니면서 병행할 수 있나요?", a: "주 3-5시간 정도면 충분합니다. 2주에 1회 모더레이팅 세션 참여 + 사전 녹화 강의 시청 + 과제 수행 정도입니다. 1기 대비 세션 빈도를 줄이고, 자율 실행 시간을 늘렸기 때문에 직장인도 충분히 병행할 수 있습니다." },
    { q: "환불 정책은 어떻게 되나요?", a: "시작 후 1주일 이내 100% 환불 가능합니다. 1주차 오프라인 세션을 경험해보고, 맞지 않으면 전액 돌려드립니다. 1주일 이후에는 환불이 어렵습니다." },
    { q: "1기와 뭐가 달라졌나요?", a: "1기 운영 경험을 바탕으로 전면 개편했습니다. 일방향 강의를 줄이고 모더레이팅 중심으로 바꿨고, 오프라인 인트로세션을 추가했습니다. 6주차 1:1 세션 이후 MAKE/SELL 트랙으로 나뉘어 각자 수준에 맞는 결과물을 만들 수 있도록 설계했습니다." },
    { q: "오프라인 모임은 필수인가요?", a: "1주차 인트로세션과 12주차 최종 발표는 오프라인으로 진행됩니다. 이 두 세션은 가능한 한 참석을 권장합니다. 나머지 세션은 온라인으로 진행되어 서울 외 지역 거주자도 참여 가능합니다." },
    { q: "해외에서 참가해도 되나요?", a: "온라인 세션 참여는 가능합니다. 다만 1주차, 12주차 오프라인 세션은 서울에서 진행되므로 참석이 어려울 수 있습니다. 시차가 맞으면 온라인 세션은 문제없이 참여 가능합니다." }
  ];

  const quotes = [
    { quote: "부업은 해봤는데, 이걸로 퇴사까지 할 수 있을지 확신이 없어요. 월 50만원은 버는데, 300만원을 벌 수 있을지는 모르겠거든요.", author: "J님, 5년차 마케터" },
    { quote: "아이디어는 있는데 뭐부터 해야 할지 막막해요. 사업자등록부터? 홈페이지부터? 검색할수록 더 혼란스러워요.", author: "S님, 7년차 기획자" },
    { quote: "회사 다니면서 혼자 준비하려니 시간도 없고, 물어볼 데도 없어요. 주변에 창업한 친구도 없고, 커뮤니티는 너무 시끄럽고요.", author: "Y님, 4년차 개발자" }
  ];

  const targets = [
    { icon: "💼", title: "퇴사를 고민 중인 직장인", desc: "언젠간 내 사업을 하고 싶지만, 지금 당장은 확신이 없는 분.\n퇴사 전에 검증해보고 싶은 분." },
    { icon: "💡", title: "아이디어는 있지만 실행이 막막한 분", desc: "머릿속에 아이템은 있는데, 어디서부터 시작해야 할지 모르는 분.\n생각이 방사되어 정리가 안 되는 분." },
    { icon: "🔥", title: "혼자 준비하다 추진력이 떨어진 분", desc: "콘텐츠나 강의는 들었지만 실행으로 연결이 안 되는 분.\n강제성과 리듬이 필요한 분." },
    { icon: "👥", title: "같은 고민을 나눌 동료가 필요한 분", desc: "주변에 창업 준비하는 사람이 없어서 외로운 분.\n서로 자극받고 밀어줄 팀이 필요한 분." },
    { icon: "🤖", title: "AI를 활용해 효율적으로 준비하고 싶은 분", desc: "본업이 바쁜데, 창업 준비까지 하려면 시간이 부족한 분.\nAI로 시간을 아끼고 싶은 분." },
  ];

  const phase1 = [
    ["1주차 (7/4~)", "오프라인 인트로세션", "라이브 세션 + AI 환경 세팅 + 방향 정렬 (\"나는 뭘 하려는가\")", "🏢 오프라인 필수"],
    ["2주차", "고객 발견", "과제 진행 — 페르소나 기반 고객 인터뷰", ""],
    ["3주차", "모더레이팅 체크업", "과제 점검 + 그룹 토론", "💬 온라인 모더레이팅"],
    ["4~5주차", "사업계획 구체화", "AI 활용 세션 (생방 or 녹화 시청) + 사업계획 완성", "🎙 라이브 세션"],
  ];

  const phase2 = [
    ["6주차", "1:1 세션", "사업계획 기반 MAKE vs. SELL 트랙 확정", "🎯 1:1 온라인"],
    ["7주차", "개인 발표", "선택 트랙 기반 액션 플랜 발표", "💬 온라인 발표"],
  ];

  const phase3 = [
    ["8~9주차", "MAKE / SELL 실행", "트랙별 실행 시작 + 그룹별 중간 진도 체크 세션 1회", "📋 중간 체크"],
    ["10주차", "진행 피드백", "1:1 진행 상황 피드백 — 방향 수정 or ongoing 피드백", "🎯 1:1 온라인"],
    ["11주차", "시장 테스트", "시장 반응 확인 + 성과 지표 정리", ""],
    ["12주차", "최종 발표", "12주 성과 발표 및 마무리", "🎉 오프라인 데모데이"],
  ];

  const tools = [
    { icon: "📊", title: "퇴사계산기", desc: "\"퇴사하면 몇 달 버틸 수 있을까?\" \"월 얼마를 벌어야 할까?\" 막연한 불안을 구체적인 숫자로 바꿔주는 시트입니다.", items: ["월 고정비 계산 (생활비, 보험, 세금 등)", "목표 수익 설정", "필요 판매량 역산", "런웨이(버틸 수 있는 개월 수) 시뮬레이션"] },
    { icon: "🤖", title: "AI 직원 프롬프트북", desc: "혼자서 마케팅, 고객응대, 리서치까지 다 하기엔 시간이 부족합니다. AI를 직원처럼 쓰는 방법을 알려드립니다.", items: ["마케팅 콘텐츠 생성 프롬프트", "고객 문의 응대 자동화", "경쟁사 리서치 프롬프트", "총 50개+ 복붙용 프롬프트"] },
    { icon: "✍️", title: "세일즈 카피 템플릿", desc: "좋은 제품도 설명을 못하면 안 팔립니다. \"사고 싶게 만드는\" 글쓰기 템플릿을 드립니다.", items: ["상세페이지 구조 템플릿", "헤드라인 공식 10가지", "가격 제시 프레이밍", "거절 사유별 대응 멘트"] }
  ];

  const results = [
    { icon: "📈", title: "내 아이템의 시장 반응 데이터", desc: "\"몇 명이 봤고, 몇 명이 관심 보였고, 몇 명이 결제했는지\" 감이 아니라 숫자로 알게 됩니다." },
    { icon: "💰", title: "실제 유료 고객 또는 구체적인 실패 원인", desc: "성공하면 첫 매출, 실패해도 \"왜 안 됐는지\" 알게 됩니다. 다음 시도의 방향이 잡힙니다." },
    { icon: "📋", title: "퇴사 여부에 대한 근거 있는 판단", desc: "\"감으로 퇴사\"가 아니라 \"데이터로 판단\"합니다. 후회 없는 결정을 내릴 수 있습니다." },
    { icon: "👥", title: "함께 성장할 동료 네트워크", desc: "12주간 같이 고생한 사람들은 쉽게 잊히지 않습니다. 프로그램 끝나도 계속 연결됩니다." },
    { icon: "🤖", title: "AI 활용 업무 자동화 역량", desc: "창업 안 하더라도, AI로 일하는 방법은 남습니다. 본업에서도 활용 가능합니다." }
  ];

  const includes = [
    "12주 주차별 가이드 + 실습 과제",
    "라이브 강의 2회 + 녹화 강의 아카이브",
    "1:1 세션 2회 (6주차, 10주차)",
    "모더레이팅 그룹 세션",
    "퇴사계산기, AI프롬프트북, 세일즈카피템플릿 등 툴킷",
    "오프라인 인트로세션 + 최종 발표 (데모데이)",
    "수료 후에도 접근 가능한 자료 아카이브"
  ];

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: '#fff', outline: 'none', WebkitAppearance: 'none' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif", overflowX: 'hidden', wordBreak: 'keep-all' }}>
      
      {/* D-Day Banner */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <span className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>2기 모집 마감</span>
          <span className="px-2.5 py-1 rounded-full text-sm sm:text-base font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
            D-{daysLeft}
          </span>
          <span className="hidden sm:inline text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>6월 30일 자정</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14" style={{ backgroundColor: '#FDF6E9' }}>
        <div className="max-w-4xl mx-auto px-5 py-16 sm:py-24 text-center relative z-10">
          <div className="absolute top-10 left-4 sm:left-10 w-16 sm:w-20 h-16 sm:h-20 rounded-full opacity-20" style={{ backgroundColor: '#FF6B35' }}></div>
          <div className="absolute bottom-16 right-4 sm:right-16 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-10" style={{ backgroundColor: '#FF6B35' }}></div>
          
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
            Founders Lab 2기 모집 중
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-5 sm:mb-6" style={{ color: '#1a1a1a' }}>
            퇴사할 결심
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed" style={{ color: '#333' }}>
            퇴사 전, 내 사업이 될 수 있는지
          </p>
          <p className="text-lg sm:text-xl md:text-2xl leading-relaxed mb-8 sm:mb-12" style={{ color: '#333' }}>
            12주 동안 직접 검증해보는 프로그램
          </p>
          
          <div className="inline-flex flex-col items-center px-5 py-4 sm:p-6 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}>
            <p className="text-xs sm:text-sm" style={{ color: '#666' }}>💡 7월 4일 시작 · 모집기간 6/13~6/30 · 소수 정예 진행</p>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6 leading-snug sm:leading-tight" style={{ color: '#1a1a1a' }}>
            직장인 76%가 퇴사를 고민하지만, 실제로 준비하는 사람은 많지 않습니다.
          </h2>
          <p className="text-base sm:text-lg mb-4" style={{ color: '#555' }}>
            막연히 "언젠간 내 사업"을 꿈꾸지만, 막상 실행에 옮기는 사람은 드뭅니다.
          </p>
          <p className="text-base sm:text-lg mb-8 sm:mb-12" style={{ color: '#555' }}>
            왜 그럴까요? 비슷한 고민을 가진 분들의 이야기입니다.
          </p>
          
          {/* Quote Cards */}
          <div className="p-5 sm:p-8 rounded-2xl mb-12 sm:mb-16" style={{ backgroundColor: '#FDF6E9' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quotes.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -top-2 -left-1 text-3xl sm:text-4xl" style={{ color: '#FF6B35' }}>"</div>
                  <p className="text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 pt-4" style={{ color: '#333' }}>{item.quote}</p>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: '#888' }}>— {item.author}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Statistics - 폐업율 */}
          <div className="text-center">
            <p className="text-base sm:text-lg mb-5 sm:mb-6" style={{ color: '#555' }}>준비 없이 퇴사하면 어떻게 될까요?</p>
            <div className="flex justify-center gap-6 sm:gap-8 mb-5 sm:mb-6">
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#FF6B35' }}>37.8%</p>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: '#666' }}>창업 1년 내 폐업</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#FF6B35' }}>58.6%</p>
                <p className="text-xs sm:text-sm mt-1 sm:mt-2" style={{ color: '#666' }}>3년 내 폐업</p>
              </div>
            </div>
            <p className="text-xs" style={{ color: '#999' }}>*중소벤처기업부, 2024</p>
            <p className="text-base sm:text-lg mt-6 sm:mt-8 leading-relaxed" style={{ color: '#333' }}>
              절반 이상이 3년을 넘기지 못합니다. 대부분 <strong>"아이템 검증" 없이</strong> 시작했기 때문입니다.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6 leading-snug" style={{ color: '#1a1a1a' }}>
            그래서 만들었습니다. 퇴사 전에 검증하는 12주.
          </h2>
          <p className="text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed" style={{ color: '#555' }}>
            Founders Lab은 단순한 창업 강의가 아닙니다. <strong>직접 아이템을 시장에 던져보고, 실제 반응을 확인하고, 퇴사 여부를 판단할 근거를 만드는 프로그램입니다.</strong>
          </p>
          
          {/* Two Outcomes */}
          <div className="p-5 sm:p-8 rounded-2xl mb-6 sm:mb-8" style={{ backgroundColor: '#1a1a1a' }}>
            <h3 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center" style={{ color: '#fff' }}>12주 후, 둘 중 하나를 알게 됩니다.</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-xl sm:text-2xl mb-2 sm:mb-3">✅</div>
                <p className="text-base sm:text-lg font-bold mb-2" style={{ color: '#fff' }}>"이 아이템, 된다. 퇴사해도 된다."</p>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>첫 유료 고객이 생겼고, 어떻게 확장할지 감이 잡힌 상태. 퇴사 후 집중하면 성장 가능성이 보입니다.</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-xl sm:text-2xl mb-2 sm:mb-3">⏸️</div>
                <p className="text-base sm:text-lg font-bold mb-2" style={{ color: '#fff' }}>"지금은 아니다. 더 준비하자."</p>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>시장 반응이 예상과 달랐고, 피봇이 필요한 상태. 회사 다니면서 방향을 수정할 시간을 벌었습니다.</p>
              </div>
            </div>
          </div>
          <p className="text-center text-base sm:text-lg" style={{ color: '#333' }}>
            <strong>어느 쪽이든, 후회 없는 결정을 내릴 수 있습니다.</strong><br/>
            막연한 불안 속에서 퇴사하는 것보다, 데이터를 보고 판단하는 것이 낫습니다.
          </p>
        </div>
      </section>

      {/* 1기 후기 Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm sm:text-base font-medium mb-2 sm:mb-3" style={{ color: '#FF6B35' }}>1기 참가자 후기</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 leading-snug" style={{ color: '#1a1a1a' }}>
            "물어볼 곳이 없을 때,<br/>물어볼 수 있는 곳이 생겼다."
          </h2>
          <p className="text-base sm:text-lg mb-10 sm:mb-14" style={{ color: '#555' }}>
            창업을 준비하면 가장 힘든 건 아이디어가 아닙니다.<br className="hidden sm:inline" />
            <strong>혼자라는 것.</strong> 1기 참가자들이 가장 많이 한 말입니다.
          </p>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 sm:-mx-0 sm:px-0 hide-scrollbar" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {[
              {
                quote: "같이 팀원처럼 고민해줘서 좋았어요. 혼자 하면 '이게 맞나?' 싶은 순간이 계속 오는데, 옆에서 같이 봐주는 사람이 있으니까 확신이 생기더라고요.",
                author: "K님",
                tag: "5년차 마케터"
              },
              {
                quote: "고민되는 걸 물어볼 선배가 있다는 게 진짜 컸어요. 검색해서는 안 나오는, 경험에서 나오는 답을 바로 들을 수 있었어요.",
                author: "P님",
                tag: "7년차 기획자"
              },
              {
                quote: "단계마다 어려울 때 필요한 현실적인 도움을 줘서 좋았어요. 이론이 아니라 '지금 이 상황에서 뭘 해야 하는지'를 알려주는 느낌.",
                author: "L님",
                tag: "4년차 디자이너"
              },
              {
                quote: "막막한 사업 진행에 있어서 진짜 도움이 됐어요. 머릿속에만 있던 게 12주 만에 실제로 돌아가는 걸 보니까 신기했어요.",
                author: "J님",
                tag: "6년차 개발자"
              },
            ].map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-[280px] sm:w-[320px] p-6 rounded-2xl relative flex flex-col justify-between" style={{ backgroundColor: '#fff', scrollSnapAlign: 'start', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                <div>
                  <div className="text-3xl mb-3" style={{ color: '#FF6B35', opacity: 0.25 }}>"</div>
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: '#333' }}>
                    {item.quote}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
                    {item.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: '#1a1a1a' }}>{item.author}</p>
                    <p className="text-xs" style={{ color: '#888' }}>{item.tag}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 sm:hidden" style={{ color: '#aaa' }}>← 밀어서 더 보기</p>

          {/* 창업지원사업 선정 케이스 */}
          <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#1a1a1a' }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,107,53,0.2)' }}>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex-1">
                <p className="text-base sm:text-lg font-bold mb-1" style={{ color: '#fff' }}>
                  1기 참가자 중 창업지원사업 선정 케이스 발생
                </p>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  파운더스랩 과정에서 정리한 사업계획과 검증 데이터로 정부 창업지원사업에 선정된 참가자가 있습니다.<br/>
                  12주간의 검증 과정이 실제 사업의 출발점이 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 sm:py-24" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1a1a1a' }}>이런 분들을 위한 프로그램입니다.</h2>
          <p className="text-base sm:text-lg mb-8 sm:mb-10" style={{ color: '#555' }}>하나라도 해당되면, 파운더스랩이 도움이 됩니다.</p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 px-5 sm:px-6 max-w-4xl mx-auto hide-scrollbar" style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
          {targets.map((item, idx) => (
            <div key={idx} className="flex-shrink-0 w-[240px] sm:w-[220px] p-5 rounded-2xl flex flex-col" style={{ backgroundColor: '#FDF6E9', scrollSnapAlign: 'start' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: '#fff' }}>
                {item.icon}
              </div>
              <h4 className="text-sm sm:text-base font-bold mb-2 leading-snug" style={{ color: '#1a1a1a' }}>{item.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: '#666', whiteSpace: 'pre-line' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs mt-3 px-5 sm:hidden" style={{ color: '#aaa' }}>← 밀어서 더 보기</p>
      </section>

      {/* What We Do - 12 Week Roadmap */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1a1a1a' }}>Founders Lab은 무엇을 하나요?</h2>
          <p className="text-base sm:text-lg mb-4" style={{ color: '#555' }}>아이디어 정리부터 실행까지, <strong>12주 동안 직접 만들고 시장에 던져보는 프로그램</strong>입니다.</p>
          <p className="text-base sm:text-lg mb-12 sm:mb-16" style={{ color: '#555' }}>강의는 최소화하고, 모더레이팅과 1:1 세션 중심으로 각자의 속도에 맞춰 실행합니다.</p>

          {/* 하나 - Roadmap */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>하나.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>12주 로드맵을 따라 실행합니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-3 sm:mb-4" style={{ color: '#555' }}>혼자 하면 "뭘 해야 하지?"에서 멈춥니다. 검증된 순서대로, 한 주씩 따라오면 됩니다.</p>

            {/* 운영 방식 안내 */}
            <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5 rounded-xl mb-4 sm:mb-5" style={{ backgroundColor: '#FDF6E9', border: '1px solid #F0E6D3' }}>
              <span className="text-lg">🎙</span>
              <div>
                <p className="text-sm sm:text-base font-bold mb-1" style={{ color: '#1a1a1a' }}>라이브 강의 2회 + 모더레이팅 세션 중심 운영</p>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}>기존 녹화본은 사전 시청 과제로 배포하고, 세션 당일은 모더레이팅만 진행합니다.</p>
                <p className="text-xs mt-1.5" style={{ color: '#888' }}>📹 강의 녹화본 제공 · *프로그램은 진행에 따라 일부 변경될 수 있습니다.</p>
              </div>
            </div>

            {/* 트랙 분화 안내 */}
            <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5 rounded-xl mb-8 sm:mb-10" style={{ backgroundColor: '#FDF6E9', border: '1px solid #F0E6D3' }}>
              <span className="text-lg">🔀</span>
              <div>
                <p className="text-sm sm:text-base font-bold mb-2" style={{ color: '#1a1a1a' }}>6주차 이후, 두 가지 트랙으로 나뉩니다</p>
                <p className="text-xs sm:text-sm mb-1" style={{ color: '#555' }}><strong>MAKE 트랙</strong> — 제품/서비스를 직접 만들어보는 트랙. 디지털 프로덕트, MVP 등을 직접 제작합니다.</p>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}><strong>SELL 트랙</strong> — 내 아이디어의 시장성을 검증하는 트랙. SNS 채널을 통해 콘텐츠를 알리고 반응을 확인합니다.</p>
                <p className="text-xs mt-2" style={{ color: '#888' }}>6주차 1:1 세션에서 각자 상황에 맞는 트랙을 함께 설계합니다.</p>
              </div>
            </div>

            {[
              { phase: "Phase 1", title: "방향 정렬 + 고객 발견 (1~5주)", desc: "\"나는 뭘 하려는가\", \"누가 내 고객인가\"를 정리합니다.", data: phase1, result: "이 단계를 거치면 내 아이디어의 방향이 잡히고, 고객이 실제로 겪는 문제를 인터뷰를 통해 확인하게 됩니다." },
              { phase: "Phase 2", title: "결정 + 액션 플랜 (6~7주)", desc: "MAKE vs. SELL — 어떤 트랙으로 실행할지 확정합니다.", data: phase2, result: "이 단계를 거치면 MAKE/SELL 트랙이 확정되고, 나머지 기간의 구체적인 액션 아이템이 정해집니다." },
              { phase: "Phase 3", title: "실행 + 시장 테스트 (8~12주)", desc: "직접 만들고, 알리고, 시장 반응을 확인합니다.", data: phase3, result: "이 단계를 거치면 실제 결과물과 시장 반응 데이터를 손에 쥐게 됩니다." }
            ].map((p, pi) => (
              <div key={pi} className="mb-8 sm:mb-10">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="flex-shrink-0 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>{p.phase}</span>
                  <span className="font-bold text-sm sm:text-lg leading-snug" style={{ color: '#1a1a1a' }}>{p.title}</span>
                </div>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4 italic" style={{ color: '#666' }}>{p.desc}</p>

                {/* 모바일용 카드 뷰 */}
                <div className="block sm:hidden space-y-3">
                  {p.data.map((row, idx) => (
                    <div key={idx} className="p-4 rounded-lg" style={{ backgroundColor: '#F9F9F9' }}>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-sm" style={{ color: '#FF6B35' }}>{row[0]}</span>
                      </div>
                      <p className="text-sm font-medium mb-1" style={{ color: '#333' }}>{row[1]}</p>
                      <p className="text-xs mb-1.5" style={{ color: '#666' }}>산출물: {row[2]}</p>
                      {row[3] && <p className="text-xs font-medium" style={{ color: '#FF6B35' }}>{row[3]}</p>}
                    </div>
                  ))}
                </div>

                {/* 데스크탑용 테이블 */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F5F5F5' }}>
                        <th className="p-3 text-left font-medium" style={{ color: '#666' }}>주차</th>
                        <th className="p-3 text-left font-medium" style={{ color: '#666' }}>핵심 활동</th>
                        <th className="p-3 text-left font-medium" style={{ color: '#666' }}>산출물</th>
                        <th className="p-3 text-left font-medium" style={{ color: '#666' }}>이벤트</th>
                      </tr>
                    </thead>
                    <tbody>
                      {p.data.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td className="p-3" style={{ color: '#333' }}>{row[0]}</td>
                          <td className="p-3" style={{ color: '#333' }}>{row[1]}</td>
                          <td className="p-3 text-xs" style={{ color: '#666' }}>{row[2]}</td>
                          <td className="p-3 text-xs font-medium whitespace-nowrap" style={{ color: row[3] ? '#FF6B35' : '#ccc' }}>{row[3] || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs sm:text-sm mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#FDF6E9', color: '#555' }}>{p.result}</p>
              </div>
            ))}
          </div>

          {/* 둘 - 모더레이팅 그룹 */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>둘.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>모더레이팅 세션으로 함께합니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-5 sm:mb-6" style={{ color: '#555' }}>혼자 하면 3가지 문제가 생깁니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {[{ num: "1", title: "막히면 멈춤", desc: "물어볼 데가 없어서 포기" }, { num: "2", title: "게을러짐", desc: "강제성이 없어서 미루다 흐지부지" }, { num: "3", title: "시야가 좁아짐", desc: "내 아이디어만 보여서 객관성 상실" }].map((item, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
                  <span className="text-xl sm:text-2xl font-bold" style={{ color: '#FF6B35' }}>{item.num}</span>
                  <p className="font-bold mt-1 sm:mt-2 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>{item.title}</p>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: '#666' }}>{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#333' }}>그래서 <strong>강의 대신 모더레이팅 방식</strong>으로 함께 정리합니다.</p>

            <div className="p-5 sm:p-6 rounded-xl mb-4" style={{ backgroundColor: '#FDF6E9' }}>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>모더레이팅 세션</h4>
              <p className="text-xs sm:text-sm mb-2" style={{ color: '#555' }}>2주에 1회, 그룹 토론 형태로 진행합니다.</p>
              <ul className="text-xs sm:text-sm space-y-1" style={{ color: '#666' }}>
                <li>• 돌아가며 각자 진행 상황 공유</li>
                <li>• 그룹 토론으로 막힌 부분 해결</li>
                <li>• 다음 2주 액션 아이템 설정</li>
              </ul>
              <p className="text-xs sm:text-sm mt-3" style={{ color: '#333' }}>일방향 강의가 아닌, <strong>서로의 이야기를 들으며 스스로 정리하는 구조</strong>입니다.</p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>6주차 이후 트랙별 그룹</h4>
              <p className="text-xs sm:text-sm mb-2" style={{ color: '#555' }}>6주차 1:1 세션 이후, MAKE/SELL 트랙별로 나뉘어 운영됩니다.</p>
              <ul className="text-xs sm:text-sm space-y-1" style={{ color: '#666' }}>
                <li>• <strong>MAKE 트랙</strong> — 제품/서비스를 직접 만들어 시장에 내놓기</li>
                <li>• <strong>SELL 트랙</strong> — SNS 콘텐츠로 아이디어의 시장성 검증하기</li>
              </ul>
              <p className="text-xs sm:text-sm mt-3" style={{ color: '#333' }}>같은 트랙의 참여자들끼리 <strong>더 깊이 있는 피드백</strong>을 주고받습니다.</p>
            </div>
          </div>

          {/* 셋 - Tools */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>셋.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>검증된 도구를 제공합니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#555' }}>맨손으로 시작하지 않아도 됩니다. <strong>바로 쓸 수 있는 템플릿과 가이드</strong>를 드립니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {tools.map((tool, idx) => (
                <div key={idx} className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{tool.icon}</div>
                  <h4 className="text-base sm:text-lg font-bold mb-2" style={{ color: '#1a1a1a' }}>{tool.title}</h4>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#555' }}>{tool.desc}</p>
                  <ul className="space-y-1">{tool.items.map((item, i) => (<li key={i} className="text-xs" style={{ color: '#666' }}>• {item}</li>))}</ul>
                </div>
              ))}
            </div>
          </div>

          {/* 넷 - 1:1 세션 & 체크업 */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>넷.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>1:1 세션과 체크업이 있습니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#555' }}>그룹 세션만으로는 부족합니다. <strong>개인별 상황에 맞춘 1:1 세션</strong>으로 방향을 잡아드립니다.</p>
            <div className="space-y-3 sm:space-y-4">
              {[{ week: "3주차", title: "모더레이팅 체크업", desc: "과제 점검 + 그룹 피드백" }, { week: "6주차", title: "1:1 세션", desc: "MAKE vs. SELL 트랙 확정" }, { week: "8~9주차", title: "중간 진도 체크", desc: "트랙별 실행 상황 점검" }, { week: "10주차", title: "1:1 피드백", desc: "진행 상황 기반 방향 수정 or 가속" }, { week: "12주차", title: "최종 발표", desc: "12주 성과 발표 + 마무리" }].map((item, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>{item.week}</span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm sm:text-base" style={{ color: '#1a1a1a' }}>{item.title}</span>
                    <span className="text-xs sm:text-sm ml-2" style={{ color: '#666' }}>— {item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm mt-4 sm:mt-6" style={{ color: '#555' }}>혼자 삽질하다 방향을 잃지 않도록, <strong>경험 있는 사람의 시선</strong>으로 점검합니다.</p>
          </div>

          {/* 다섯 - Founders Night */}
          <div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>다섯.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>파운더스 나잇으로 마무리합니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#555' }}>12주간의 여정을 마무리하는 오프라인 행사입니다.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
                <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>🎤 데모데이</h4>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}>각 팀이 12주간의 결과를 발표합니다. 어떤 아이템으로 시작했는지, 시장 반응은 어땠는지, 퇴사할 건지 더 준비할 건지.</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
                <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>🎓 선배 창업가 세션</h4>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}>먼저 퇴사하고 창업한 선배들의 생생한 경험담을 듣습니다. 성공과 실패, 퇴사 타이밍, 현실적인 조언까지.</p>
              </div>
              <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
                <h4 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>🤝 네트워킹</h4>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}>같은 고민을 가진 사람들과 직접 만납니다. 조원들, 선배 창업가들과 앞으로도 이어질 관계를 만듭니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#fff' }}>참가 후 얻게 되는 결과</h2>
          <p className="text-center mb-8 sm:mb-12 text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>12주 후, 이런 것들을 손에 쥐게 됩니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {results.map((item, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <div className="text-xl sm:text-2xl mb-2 sm:mb-3">{item.icon}</div>
                <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base" style={{ color: '#fff' }}>{item.title}</h4>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1a1a1a' }}>누가 운영하나요?</h2>
          <p className="text-base sm:text-lg mb-8 sm:mb-12" style={{ color: '#555' }}>직접 창업하고, 투자받고, 매각까지 해본 사람들이 운영합니다. 이론이 아니라 경험에서 나온 프로그램입니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#fff' }}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mb-3 sm:mb-4 flex items-center justify-center text-2xl sm:text-3xl" style={{ backgroundColor: '#FDF6E9' }}>👩‍💼</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#1a1a1a' }}>하이수 대표</h3>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#FF6B35' }}>쉬벤처스 대표</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm" style={{ color: '#555' }}>
                <li>• Bain & Company 이사 출신 (전략 컨설팅)</li>
                <li>• 매일유업 전략기획실, 삼성전자 근무</li>
                <li>• 직접 창업 → 누적 50억 자금 조달</li>
                <li>• 이화여대, 서울산업진흥원, KT,<br className="sm:hidden" /> 현대차그룹 창업 프로그램 운영</li>
                <li>• 연세대 경영학과 / 시카고대 Booth MBA</li>
              </ul>
            </div>
            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#fff' }}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mb-3 sm:mb-4 flex items-center justify-center text-2xl sm:text-3xl" style={{ backgroundColor: '#FDF6E9' }}>👩‍💻</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#1a1a1a' }}>이혜린 부대표</h3>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#FF6B35' }}>쉬벤처스 공동창업자</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm" style={{ color: '#555' }}>
                <li>• 육아상담 플랫폼 '그로잉맘' 창업 후 매각</li>
                <li>• 푸드·뷰티테크·헬스케어·교육 비즈니스<br className="sm:hidden" /> CSO/COO 역임</li>
                <li>• 하비탄AI AX교육 총괄</li>
                <li>• 이화여대 스테이션이화 멘토 /<br className="sm:hidden" /> 모두의창업 멘토 (서울창조경제혁신센터·인벤션랩)</li>
                <li>• 사단법인 더나일 이사</li>
                <li>• 《엄마의 속도로 일하고 있습니다》 저자</li>
                <li>• 이화여대 석사 / 고려대 창업학 박사과정</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center" style={{ color: '#1a1a1a' }}>Founders Lab 2기</h2>
          <div className="max-w-xl mx-auto p-5 sm:p-8 rounded-2xl" style={{ backgroundColor: '#FDF6E9', border: '2px solid #F0E6D3' }}>
            <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
              <div><p className="text-xs sm:text-sm" style={{ color: '#666' }}>기간</p><p className="font-medium text-sm sm:text-base" style={{ color: '#1a1a1a' }}>12주 (7월 4일 시작)</p></div>
              <div><p className="text-xs sm:text-sm" style={{ color: '#666' }}>형태</p><p className="font-medium text-sm sm:text-base leading-snug" style={{ color: '#1a1a1a' }}>온라인 중심<br className="sm:hidden" /> + 오프라인 2회</p></div>
            </div>

            {/* 가격 */}
            <div className="text-center py-5 sm:py-6 mb-5 sm:mb-6" style={{ borderTop: '1px solid #E8DFD0', borderBottom: '1px solid #E8DFD0' }}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>2기</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#1a1a1a' }}>490,000원</p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#666' }}>모집기간: 6월 13일 ~ 6월 30일</p>
            </div>
            
            <div className="mb-6 sm:mb-8">
              <p className="font-medium mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>포함 사항</p>
              <ul className="space-y-2">{includes.map((item, idx) => (<li key={idx} className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: '#555' }}><span className="flex-shrink-0" style={{ color: '#FF6B35' }}>✓</span> <span>{item}</span></li>))}</ul>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,107,53,0.1)' }}>
              <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>왜 이 가격인가요?</p>
              <p className="text-xs sm:text-sm" style={{ color: '#555' }}>
                창업 강의 하나에 50-100만원. 코칭 프로그램은 200-500만원. Founders Lab은 12주간 1:1 세션, 모더레이팅, 오프라인 세션까지 포함하여 <strong>월 16만원 수준</strong>으로 체계적인 검증 과정을 경험할 수 있습니다. 퇴사 후 실패해서 잃는 비용을 생각하면, <strong>퇴사 전에 검증하는 것</strong>이 훨씬 합리적입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center" style={{ color: '#fff' }}>2기 신청하기</h2>
          <p className="text-center text-sm sm:text-base mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>아래 정보를 입력해주시면 담당자가 확인 후 연락드립니다.</p>
          <p className="text-center text-sm sm:text-base mb-8 sm:mb-12" style={{ color: '#FF6B35' }}>모집기간: 6월 13일 ~ 6월 30일</p>
          
          {submitSuccess ? (
            <div className="text-center p-8 sm:p-12 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div className="text-4xl sm:text-5xl mb-4">🎉</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#fff' }}>신청이 완료되었습니다!</h3>
              <p className="text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>입력하신 연락처로 1-2일 내로 안내드리겠습니다.</p>
            </div>
          ) : (
            <div className="p-5 sm:p-8 rounded-2xl" style={{ backgroundColor: '#fff' }}>
              <div className="space-y-6 sm:space-y-8">
                {/* 기본 정보 */}
                <div>
                  <h4 className="font-bold mb-4 pb-2 text-sm sm:text-base" style={{ color: '#1a1a1a', borderBottom: '2px solid #FF6B35' }}>기본 정보</h4>
                  <div className="space-y-4">
                    <div>
                      <label style={labelStyle}>이름 *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="홍길동" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>연락처 *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="010-0000-0000" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>이메일 *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@email.com" style={inputStyle} required />
                    </div>
                  </div>
                </div>

                {/* 직장 정보 */}
                <div>
                  <h4 className="font-bold mb-4 pb-2 text-sm sm:text-base" style={{ color: '#1a1a1a', borderBottom: '2px solid #FF6B35' }}>직장 정보</h4>
                  <div className="space-y-4">
                    <div>
                      <label style={labelStyle}>직무/직종 *</label>
                      <input type="text" name="job" value={formData.job} onChange={handleInputChange} placeholder="예: 마케팅, 개발, 기획 등" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={labelStyle}>연차 *</label>
                      <select name="years" value={formData.years} onChange={handleInputChange} style={inputStyle} required>
                        <option value="">선택해주세요</option>
                        <option value="1-3">1~3년차</option>
                        <option value="4-6">4~6년차</option>
                        <option value="7-10">7~10년차</option>
                        <option value="10+">10년차 이상</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 아이디어 정보 */}
                <div>
                  <h4 className="font-bold mb-4 pb-2 text-sm sm:text-base" style={{ color: '#1a1a1a', borderBottom: '2px solid #FF6B35' }}>사업 아이디어</h4>
                  <div className="mb-4">
                    <label style={labelStyle}>현재 아이디어가 있으신가요? *</label>
                    <div className="flex flex-wrap gap-3 sm:gap-4 mt-2">
                      {["있다", "대략적으로 있다", "없다"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="hasIdea" value={opt} checked={formData.hasIdea === opt} onChange={handleInputChange} style={{ width: '18px', height: '18px' }} />
                          <span className="text-sm" style={{ color: '#333' }}>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {(formData.hasIdea === "있다" || formData.hasIdea === "대략적으로 있다") && (
                    <div className="mb-4">
                      <label style={labelStyle}>아이디어를 간단히 설명해주세요</label>
                      <textarea name="ideaDesc" value={formData.ideaDesc} onChange={handleInputChange} placeholder="어떤 문제를 해결하고 싶은지, 어떤 서비스/제품을 생각하고 있는지 자유롭게 적어주세요." rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }} />
                    </div>
                  )}
                </div>

                {/* 참가 목표 */}
                <div>
                  <h4 className="font-bold mb-4 pb-2 text-sm sm:text-base" style={{ color: '#1a1a1a', borderBottom: '2px solid #FF6B35' }}>참가 목표</h4>
                  <div className="space-y-4">
                    <div>
                      <label style={labelStyle}>이 프로그램에서 가장 얻고 싶은 것은? *</label>
                      <select name="goal" value={formData.goal} onChange={handleInputChange} style={inputStyle} required>
                        <option value="">선택해주세요</option>
                        <option value="validation">내 아이디어 검증</option>
                        <option value="firstSale">첫 유료 고객/매출</option>
                        <option value="network">함께할 동료 네트워크</option>
                        <option value="skills">창업/사업 스킬</option>
                        <option value="decision">퇴사 여부 결정</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>프로그램을 어떻게 알게 되셨나요? <span style={{ fontWeight: 400, color: '#999' }}>(복수 선택 가능)</span></label>
                      <div className="flex flex-wrap gap-x-5 gap-y-3 mt-2">
                        {[
                          { value: 'instagram', label: '인스타그램' },
                          { value: 'threads', label: '스레드' },
                          { value: 'openchat', label: '오픈카톡방' },
                          { value: 'linkedin', label: '링크드인' },
                          { value: 'blog', label: '블로그/검색' },
                          { value: 'referral', label: '지인 추천' },
                          { value: 'other', label: '기타' },
                        ].map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="heardFrom"
                              value={opt.value}
                              checked={formData.heardFrom.includes(opt.value)}
                              onChange={handleInputChange}
                              style={{ width: '18px', height: '18px', accentColor: '#FF6B35' }}
                            />
                            <span className="text-sm" style={{ color: '#333' }}>{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 개인정보 동의 */}
                <div className="pt-4" style={{ borderTop: '1px solid #eee' }}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="agreePrivacy" checked={formData.agreePrivacy} onChange={handleInputChange} style={{ width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }} />
                    <span className="text-sm" style={{ color: '#555' }}>
                      <button type="button" onClick={() => setShowPrivacy(true)} className="underline" style={{ color: '#FF6B35' }}>개인정보 수집 및 이용</button>에 동의합니다. (필수)
                    </span>
                  </label>
                </div>

                {/* 에러 메시지 */}
                {submitError && (
                  <p className="text-center text-sm" style={{ color: '#ff4444' }}>{submitError}</p>
                )}

                {/* 제출 버튼 - 가운데 정렬 */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-12 py-4 rounded-full text-base sm:text-lg font-bold transition-all"
                    style={{ backgroundColor: isSubmitting ? '#ccc' : '#FF6B35', color: '#fff', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    {isSubmitting ? '제출 중...' : '신청하기'}
                  </button>
                </div>
                
                <p className="text-center text-xs" style={{ color: '#999' }}>
                  신청 후 1-2일 내로 안내 연락을 드립니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center" style={{ color: '#1a1a1a' }}>FAQ</h2>
          <div className="space-y-3 sm:space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden" style={{ backgroundColor: '#fff' }}>
                <button onClick={() => toggleFaq(idx)} className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3" style={{ color: '#1a1a1a' }}>
                  <span className="font-medium text-sm sm:text-base leading-snug">Q. {faq.q}</span>
                  <span className="text-lg sm:text-xl flex-shrink-0" style={{ color: '#FF6B35' }}>{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (<div className="px-4 sm:px-5 pb-4 sm:pb-5"><p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#555' }}>{faq.a}</p></div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-6" style={{ color: '#fff' }}>12주 뒤, 후회 없는 결정을 내리세요.</h2>
          <p className="text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
            지금 퇴사하면 어떻게 될지 모릅니다.<br/>
            하지만 12주 후에는 알게 됩니다.<br/><br/>
            <strong style={{ color: '#fff' }}>퇴사해도 되는지, 아직 아닌지.</strong>
          </p>
          <p className="mb-8 sm:mb-10 text-sm sm:text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>막연한 불안 속에서 고민만 하는 것보다, 직접 해보고 판단하는 것이 낫습니다.</p>
          <button
            onClick={scrollToApply}
            className="inline-block px-8 sm:px-10 py-3.5 sm:py-4 rounded-full text-base sm:text-lg font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: '#FF6B35', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            2기 신청하기
          </button>
          <p className="text-xs sm:text-sm mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>모집 마감 D-{daysLeft} · 7월 4일 시작</p>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-40" style={{ backgroundColor: 'rgba(26,26,26,0.98)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Founders Lab 2기 · D-{daysLeft}</p>
            <p className="font-bold text-sm sm:text-base" style={{ color: '#fff' }}>490,000원</p>
          </div>
          <div className="sm:hidden">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>490,000원 · D-{daysLeft}</p>
          </div>
          <button
            onClick={scrollToApply}
            className="flex-shrink-0 text-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base transition-transform hover:scale-105"
            style={{ backgroundColor: '#FF6B35', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            신청하기
          </button>
        </div>
      </div>

      <div className="h-16 sm:h-20"></div>

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-8" style={{ backgroundColor: '#fff' }}>
            <div className="flex justify-between items-center mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#1a1a1a' }}>개인정보 수집 및 이용 동의</h3>
              <button onClick={() => setShowPrivacy(false)} className="text-2xl p-1" style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            
            <div className="space-y-5 sm:space-y-6 text-xs sm:text-sm" style={{ color: '#555' }}>
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>1. 수집하는 개인정보 항목</h4>
                <p>쉬벤처스(이하 "회사")는 Founders Lab 프로그램 신청을 위해 아래와 같은 개인정보를 수집합니다.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>필수항목: 이름, 연락처(휴대전화번호), 이메일, 직무/직종, 연차</li>
                  <li>선택항목: 사업 아이디어 설명, 참가 목표, 유입 경로</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>2. 개인정보의 수집 및 이용 목적</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>프로그램 신청 접수 및 본인 확인</li>
                  <li>프로그램 관련 안내 및 상담</li>
                  <li>조 편성 및 프로그램 운영</li>
                  <li>참가자 간 네트워킹 지원</li>
                  <li>서비스 개선을 위한 통계 분석</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>3. 개인정보의 보유 및 이용 기간</h4>
                <p>수집된 개인정보는 프로그램 종료 후 <strong>1년간</strong> 보유하며, 이후 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>4. 개인정보의 제3자 제공</h4>
                <p>회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 아래의 경우는 예외로 합니다.</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>이용자가 사전에 동의한 경우</li>
                  <li>법령에 의해 요구되는 경우</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>5. 동의 거부 권리 및 불이익</h4>
                <p>귀하는 개인정보 수집 및 이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수항목에 대한 동의를 거부할 경우 프로그램 신청이 제한될 수 있습니다.</p>
              </div>
              
              <div>
                <h4 className="font-bold mb-2" style={{ color: '#1a1a1a' }}>6. 개인정보 보호 책임자</h4>
                <ul className="space-y-1">
                  <li>담당자: 쉬벤처스 운영팀</li>
                  <li>이메일: contact@sheventures.com</li>
                </ul>
              </div>
            </div>
            
            <button onClick={() => setShowPrivacy(false)} className="w-full mt-6 sm:mt-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base" style={{ backgroundColor: '#FF6B35', color: '#fff', border: 'none', cursor: 'pointer' }}>
              확인
            </button>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <footer className="py-8 sm:py-12 px-5 sm:px-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>쉬벤처스 | 대표: 하이수</p>
          <p className="text-xs mb-3 sm:mb-4" style={{ color: 'rgba(255,255,255,0.3)', wordBreak: 'keep-all' }}>사업자등록번호: 000-00-00000<br className="sm:hidden" /> | 통신판매업신고: 2024-서울강남-0000</p>
          <button onClick={() => setShowPrivacy(true)} className="text-xs underline" style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>개인정보처리방침</button>
        </div>
      </footer>
    </div>
  );
};

export default FoundersLabLanding;
