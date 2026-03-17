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

  // D-day 계산 (마감일: 2026년 3월 28일 23:59:59)
  useEffect(() => {
    const calculateDaysLeft = () => {
      const deadline = new Date('2026-03-28T23:59:59+09:00'); // 한국시간 기준
      const now = new Date();
      const diff = deadline - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      setDaysLeft(days > 0 ? days : 0);
    };
    
    calculateDaysLeft();
    // 매분 업데이트
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

      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJ0MGexwOLsx2Jg5QnS1a2jxYEykoJOGJ_0ESLUF5VQQAbgTLjX1KOkgYbeQ1zApAh/exec';
      const params = new URLSearchParams(submitData);
      await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
      });

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
    { q: "아직 아이디어가 없어도 참가할 수 있나요?", a: "가능합니다. 1주차에 아이디어를 정리하는 것부터 시작합니다. 완전히 백지 상태라면, 조원 프로젝트에 합류해서 다른 사람의 아이템을 함께 검증하는 것도 방법입니다. 그 과정에서 본인 아이템이 떠오르는 경우도 많습니다." },
    { q: "직장 다니면서 병행할 수 있나요?", a: "주 3-5시간 정도면 충분합니다. 주간 과제 수행 2-3시간, 피어 세션 참여 1시간, 자료 학습 1시간(선택) 정도입니다. AI 자동화를 활용해 시간을 아끼는 방법도 함께 다룹니다. \"시간이 없어서\"가 아니라 \"효율적으로 쓰는 방법을 몰라서\"인 경우가 많습니다." },
    { q: "환불 정책은 어떻게 되나요?", a: "시작 후 1주일 이내 100% 환불 가능합니다. 1주차 과제를 해보고, 맞지 않으면 전액 돌려드립니다. 1주일 이후에는 환불이 어렵습니다." },
    { q: "오프라인 모임은 필수인가요?", a: "필수는 아닙니다. 온라인으로도 충분히 참여 가능합니다. 다만 네트워킹과 피드백 측면에서 오프라인 참석을 권장합니다. 서울 외 지역 거주자를 위해 온라인 참여 옵션도 제공합니다." },
    { q: "기수 중간에 참여할 수 있나요?", a: "커리큘럼 특성상 중간 합류는 어렵습니다. 12주가 유기적으로 연결되어 있어서, 중간에 들어오면 따라가기 힘듭니다. 다음 기수 오픈 시 안내 신청을 해주세요." },
    { q: "해외에서 참가해도 되나요?", a: "온라인 참여는 가능합니다. 피어 세션은 한국 시간 기준 저녁에 진행되므로, 시차가 맞으면 문제 없습니다. 오프라인 모임(파운더스 나잇)은 서울에서 진행됩니다." }
  ];

  const quotes = [
    { quote: "부업은 해봤는데, 이걸로 퇴사까지 할 수 있을지 확신이 없어요. 월 50만원은 버는데, 300만원을 벌 수 있을지는 모르겠거든요.", author: "J님, 5년차 마케터" },
    { quote: "아이디어는 있는데 뭐부터 해야 할지 막막해요. 사업자등록부터? 홈페이지부터? 검색할수록 더 혼란스러워요.", author: "S님, 7년차 기획자" },
    { quote: "회사 다니면서 혼자 준비하려니 시간도 없고, 물어볼 데도 없어요. 주변에 창업한 친구도 없고, 커뮤니티는 너무 시끄럽고요.", author: "Y님, 4년차 개발자" }
  ];

  const targets = [
    { title: "퇴사를 고민 중인 직장인", desc: "언젠간 내 사업을 하고 싶지만, 지금 당장은 확신이 없는 분. 퇴사 전에 검증해보고 싶은 분." },
    { title: "아이디어는 있지만 실행이 막막한 분", desc: "머릿속에 아이템은 있는데, 어디서부터 시작해야 할지 모르는 분. 혼자 검색하다 지친 분." },
    { title: "부업 경험은 있지만 확장이 안 되는 분", desc: "스마트스토어, 클래스101, 프리랜서 등 해봤지만 '내 사업'으로 키우는 방법을 모르는 분." },
    { title: "같은 고민을 나눌 동료가 필요한 분", desc: "주변에 창업 준비하는 사람이 없어서 외로운 분. 서로 자극받고 밀어줄 팀이 필요한 분." },
    { title: "AI를 활용해 효율적으로 준비하고 싶은 분", desc: "본업이 바쁜데, 창업 준비까지 하려면 시간이 부족한 분. AI로 시간을 아끼고 싶은 분." }
  ];

  const phase1 = [
    ["1주 (4/5~)", "문제 정의", "비즈니스 블루프린트 (수익방정식 및 로직트리)", "🎙 4월 5일(일) 오후 8시"],
    ["2주 (4/12~)", "고객 검증", "잠재고객 5인 딥인터뷰 결과 및 페인포인트 분석 리포트", ""],
    ["3주 (4/19~)", "가치 제안", "비즈니스 모델 캔버스", "🎙 4월 19일(일) 오후 8시"],
    ["4주 (4/26~)", "재무 설계", "퇴사 목표 대시보드", "📋 온라인 체크업 1차"],
  ];
  
  const phase2 = [
    ["5주 (5/3~)", "AI 부서 세팅", "부서별 가상 조직도 및 1호 AI직원", "🎙 5월 3일(일) 오후 8시"],
    ["6주 (5/10~)", "Dirty MVP 런칭", "결제 링크 포함된 Dirty MVP", ""],
    ["7주 (5/17~)", "마케팅 엔진 가동", "콘텐츠 캘린더 및 채널별 배포 실행안", "🎙 5월 17일(일) 오후 8시"],
    ["8주 (5/24~)", "중간 체크업", "유입-클릭-전환 데이터 취합 및 병목 구간 분석 보고서", "📋 온라인 체크업 2차"],
  ];
  
  const phase3 = [
    ["9주 (5/31~)", "고전환 세일즈 퍼널 최적화", "고도화 상세페이지 및 CX자동화 워크플로우", "🎙 5월 31일(일) 오후 8시"],
    ["10주 (6/7~)", "수익 실현 및 첫 매출 확보", "유료 결제 또는 유효 리드 DB", ""],
    ["11주 (6/14~)", "경제성 평가", "실제 집행 데이터 기반 수익성 검증 및 퇴사 적합성 최종 평가", ""],
    ["12주 (6/21~)", "최종 판정", "90일 성과 및 향후 로드맵 포함 3분 피치 덱", "🎉 파운더스 나잇 (데모데이)"],
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
    "퇴사계산기, AI프롬프트북, 세일즈카피템플릿 등 툴킷 전체",
    "6인 1조 피어 커뮤니티 (운영진 직접 편성)",
    "운영진 중간 체크업 (4주/8주/12주)",
    "파운더스 나잇 (데모데이 + 네트워킹)",
    "수료 후에도 접근 가능한 자료 아카이브"
  ];

  const inputStyle = { width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: '#fff', outline: 'none', WebkitAppearance: 'none' };
  const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#333' };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF8F5', fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      
      {/* D-Day Banner */}
      <div className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
          <span className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>1기 모집 마감</span>
          <span className="px-2.5 py-1 rounded-full text-sm sm:text-base font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>
            D-{daysLeft}
          </span>
          <span className="hidden sm:inline text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>3월 28일 자정</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12" style={{ backgroundColor: '#FDF6E9' }}>
        <div className="max-w-4xl mx-auto px-5 py-16 sm:py-24 text-center relative z-10">
          <div className="absolute top-10 left-4 sm:left-10 w-16 sm:w-20 h-16 sm:h-20 rounded-full opacity-20" style={{ backgroundColor: '#FF6B35' }}></div>
          <div className="absolute bottom-16 right-4 sm:right-16 w-24 sm:w-32 h-24 sm:h-32 rounded-full opacity-10" style={{ backgroundColor: '#FF6B35' }}></div>
          
          <div className="inline-block px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
            Founders Lab 1기 모집 중
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
            <p className="text-xs sm:text-sm" style={{ color: '#666' }}>💡 4월 1일 시작 · 소수 정예 진행, 마감 시 조기 종료</p>
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

      {/* Target Audience */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#FAF8F5' }}>
        <div className="max-w-4xl mx-auto">
          <div className="p-5 sm:p-8 rounded-2xl" style={{ backgroundColor: '#FDF6E9', border: '2px solid #F0E6D3' }}>
            <div className="flex items-center gap-2 mb-5 sm:mb-6">
              <span className="text-xl sm:text-2xl">👤</span>
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: '#1a1a1a' }}>이런 분들을 위한 프로그램입니다.</h3>
            </div>
            <div className="space-y-4">
              {targets.map((item, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-3">
                  <span className="flex-shrink-0" style={{ color: '#FF6B35' }}>✓</span>
                  <div>
                    <span className="font-bold text-sm sm:text-base" style={{ color: '#1a1a1a' }}>{item.title}</span>
                    <p className="text-xs sm:text-sm mt-0.5 sm:mt-1" style={{ color: '#666' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Do - 12 Week Roadmap */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4" style={{ color: '#1a1a1a' }}>Founders Lab은 무엇을 하나요?</h2>
          <p className="text-base sm:text-lg mb-4" style={{ color: '#555' }}>아이디어 검증부터 첫 매출까지, <strong>12주 동안 직접 실행해보는 프로그램</strong>입니다.</p>
          <p className="text-base sm:text-lg mb-12 sm:mb-16" style={{ color: '#555' }}>강의만 듣고 끝나는 프로그램이 아닙니다. 매주 과제를 수행하고, 시장에 직접 부딪혀봅니다.</p>

          {/* 하나 - Roadmap */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>하나.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>12주 로드맵을 따라 실행합니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-3 sm:mb-4" style={{ color: '#555' }}>혼자 하면 "뭘 해야 하지?"에서 멈춥니다. 검증된 순서대로, 한 주씩 따라오면 됩니다.</p>

            {/* 온라인 라이브 강의 안내 */}
            <div className="flex flex-wrap items-start gap-3 p-4 sm:p-5 rounded-xl mb-8 sm:mb-10" style={{ backgroundColor: '#FDF6E9', border: '1px solid #F0E6D3' }}>
              <span className="text-lg">🎙</span>
              <div>
                <p className="text-sm sm:text-base font-bold mb-1" style={{ color: '#1a1a1a' }}>온라인 라이브 강의 — 총 6회 (매 2주 일요일 오후 8시)</p>
                <p className="text-xs sm:text-sm" style={{ color: '#555' }}>4/5 · 4/19 · 5/3 · 5/17 · 5/31 · 12주차 파운더스 나잇</p>
                <p className="text-xs mt-1.5" style={{ color: '#888' }}>📹 불참 시 녹화본을 제공해드립니다. · *강의 프로그램은 스터디 진행에 따라 변경될 수 있습니다.</p>
              </div>
            </div>

            {/* Phase 0 */}
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl" style={{ backgroundColor: '#F5F5F5' }}>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{ backgroundColor: '#1a1a1a', color: '#fff' }}>Phase 0</span>
                <span className="font-bold text-sm sm:text-base" style={{ color: '#1a1a1a' }}>4월 1일 ~ 4월 4일 · 조편성 및 오리엔테이션</span>
              </div>
            </div>

            {[
              { phase: "Phase 1", title: "비즈니스 로직 구조화 (1-4주)", desc: "\"내 아이디어가 정말 돈이 될까?\"를 검증합니다.", data: phase1, result: "이 단계를 거치면 \"월 얼마를 벌어야 퇴사할 수 있는지\", \"그러려면 몇 명에게 팔아야 하는지\" 숫자로 알게 됩니다." },
              { phase: "Phase 2", title: "실행 인프라 구축 및 시장 반응 확인 (5-8주)", desc: "\"사람들이 정말 관심을 가질까?\"를 검증합니다.", data: phase2, result: "이 단계를 거치면 \"몇 명이 관심을 보이는지\", \"어떤 메시지에 반응하는지\" 데이터로 확인합니다." },
              { phase: "Phase 3", title: "수익 로직 업그레이드 (9-12주)", desc: "\"실제로 돈을 낼까?\"를 검증합니다.", data: phase3, result: "이 단계를 거치면 \"실제 유료 고객\" 또는 \"왜 안 되는지에 대한 구체적인 피드백\"을 얻습니다." }
            ].map((p, pi) => (
              <div key={pi} className="mb-8 sm:mb-10">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>{p.phase}</span>
                  <span className="font-bold text-base sm:text-lg" style={{ color: '#1a1a1a' }}>{p.title}</span>
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

          {/* 둘 - Peer Community */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>둘.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>6인 1조 피어 커뮤니티로 함께합니다.</h3>
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
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#333' }}>그래서 <strong>서로 역량이 보완되는 6명이 한 조</strong>가 됩니다.</p>
            
            <div className="p-5 sm:p-6 rounded-xl mb-4" style={{ backgroundColor: '#FDF6E9' }}>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>조 편성 원칙</h4>
              <p className="text-xs sm:text-sm mb-3" style={{ color: '#555' }}>신청서에 본인 스킬과 필요한 도움을 작성하면, 운영진이 직접 조를 편성합니다.</p>
              <p className="text-xs sm:text-sm" style={{ color: '#666' }}>예: 마케팅 잘하는 A + 개발 잘하는 B + 디자인 잘하는 C → <strong>서로 부족한 부분을 채워주는 구성</strong></p>
            </div>
            
            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#FDF6E9' }}>
              <h4 className="font-bold mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>주간 피어 세션</h4>
              <p className="text-xs sm:text-sm mb-2" style={{ color: '#555' }}>매주 1회, 조원끼리 온라인으로 모입니다.</p>
              <ul className="text-xs sm:text-sm space-y-1" style={{ color: '#666' }}>
                <li>• 이번 주 과제 공유 + 피드백</li>
                <li>• 막힌 부분 함께 해결</li>
                <li>• 다음 주 목표 설정 + 상호 약속</li>
              </ul>
              <p className="text-xs sm:text-sm mt-3" style={{ color: '#333' }}>혼자 하면 "다음 주에 해야지" 하다가 한 달이 갑니다. <strong>조원에게 약속하면 안 할 수가 없습니다.</strong></p>
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

          {/* 넷 - Checkup */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#FF6B35' }}>넷.</span>
              <h3 className="text-xl sm:text-2xl font-bold" style={{ color: '#1a1a1a' }}>운영진 체크업이 있습니다.</h3>
            </div>
            <p className="text-base sm:text-lg mb-6 sm:mb-8" style={{ color: '#555' }}>조원끼리 해결 안 되는 문제도 있습니다. <strong>운영진이 중간중간 체크업</strong>을 진행합니다.</p>
            <div className="space-y-3 sm:space-y-4">
              {[{ week: "4주차", title: "Phase 1 점검", desc: "아이템 방향성 피드백" }, { week: "8주차", title: "Phase 2 점검", desc: "MVP/마케팅 피드백" }, { week: "12주차", title: "최종 판정", desc: "퇴사 여부 의견 제시" }].map((item, idx) => (
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

      {/* Founders Section - 50억으로 수정 */}
      <section className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#FAF8F5' }}>
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
                <li>• 이화여대, 서울산업진흥원, KT, 현대차그룹 창업 프로그램 운영</li>
                <li>• 연세대 경영학과 / 시카고대 Booth MBA</li>
              </ul>
            </div>
            <div className="p-5 sm:p-6 rounded-xl" style={{ backgroundColor: '#fff' }}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full mb-3 sm:mb-4 flex items-center justify-center text-2xl sm:text-3xl" style={{ backgroundColor: '#FDF6E9' }}>👩‍💻</div>
              <h3 className="text-lg sm:text-xl font-bold mb-1" style={{ color: '#1a1a1a' }}>이혜린 부대표</h3>
              <p className="text-xs sm:text-sm mb-3 sm:mb-4" style={{ color: '#FF6B35' }}>쉬벤처스 공동창업자</p>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm" style={{ color: '#555' }}>
                <li>• 육아상담 플랫폼 '그로잉맘' 창업 후 매각</li>
                <li>• AI Agent 스타트업 원더스랩 COO</li>
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
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center" style={{ color: '#1a1a1a' }}>Founders Lab 1기</h2>
          <div className="max-w-xl mx-auto p-5 sm:p-8 rounded-2xl" style={{ backgroundColor: '#FDF6E9', border: '2px solid #F0E6D3' }}>
            <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-8">
              <div><p className="text-xs sm:text-sm" style={{ color: '#666' }}>기간</p><p className="font-medium text-sm sm:text-base" style={{ color: '#1a1a1a' }}>12주 (4월 1일 시작)</p></div>
              <div><p className="text-xs sm:text-sm" style={{ color: '#666' }}>형태</p><p className="font-medium text-sm sm:text-base" style={{ color: '#1a1a1a' }}>온라인 + 월 1회 오프라인</p></div>
            </div>
            
            {/* 정상가/1기 특별가 */}
            <div className="text-center py-5 sm:py-6 mb-5 sm:mb-6" style={{ borderTop: '1px solid #E8DFD0', borderBottom: '1px solid #E8DFD0' }}>
              <p className="text-base sm:text-lg mb-1" style={{ color: '#999', textDecoration: 'line-through' }}>정상가 490,000원</p>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: '#FF6B35', color: '#fff' }}>1기 특별가</span>
              </div>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#1a1a1a' }}>297,000원</p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: '#666' }}>월 99,000원 × 3개월</p>
            </div>
            
            <div className="mb-6 sm:mb-8">
              <p className="font-medium mb-3 sm:mb-4 text-sm sm:text-base" style={{ color: '#1a1a1a' }}>포함 사항</p>
              <ul className="space-y-2">{includes.map((item, idx) => (<li key={idx} className="flex items-start gap-2 text-xs sm:text-sm" style={{ color: '#555' }}><span className="flex-shrink-0" style={{ color: '#FF6B35' }}>✓</span> <span>{item}</span></li>))}</ul>
            </div>
            
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(255,107,53,0.1)' }}>
              <p className="text-xs sm:text-sm font-medium mb-2" style={{ color: '#1a1a1a' }}>왜 이 가격인가요?</p>
              <p className="text-xs sm:text-sm" style={{ color: '#555' }}>
                창업 강의 하나에 50-100만원. 코칭 프로그램은 200-500만원. Founders Lab은 <strong>월 10만원 이하</strong>로 12주간 체계적인 검증 과정을 경험할 수 있습니다. 퇴사 후 실패해서 잃는 비용을 생각하면, <strong>퇴사 전에 30만원으로 검증하는 것</strong>이 훨씬 합리적입니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section id="apply" className="py-16 sm:py-24 px-5 sm:px-6" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-center" style={{ color: '#fff' }}>1기 신청하기</h2>
          <p className="text-center text-sm sm:text-base mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>아래 정보를 입력해주시면 담당자가 확인 후 연락드립니다.</p>
          <p className="text-center text-sm sm:text-base mb-8 sm:mb-12" style={{ color: '#FF6B35' }}>마감: 3월 28일 자정</p>
          
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
            1기 신청하기
          </button>
          <p className="text-xs sm:text-sm mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>마감 D-{daysLeft} · 소수 정예 진행</p>
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-40" style={{ backgroundColor: 'rgba(26,26,26,0.98)' }}>
        <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs sm:text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Founders Lab 1기 · D-{daysLeft}</p>
            <p className="font-bold text-sm sm:text-base" style={{ color: '#fff' }}><span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal', fontSize: '12px' }}>490,000원</span> 297,000원</p>
          </div>
          <div className="sm:hidden">
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}><span style={{ textDecoration: 'line-through' }}>49만</span> 297,000원 · D-{daysLeft}</p>
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
          <p className="text-xs mb-3 sm:mb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>사업자등록번호: 000-00-00000 | 통신판매업신고: 2024-서울강남-0000</p>
          <button onClick={() => setShowPrivacy(true)} className="text-xs underline" style={{ color: 'rgba(255,255,255,0.4)', background: 'none', border: 'none', cursor: 'pointer' }}>개인정보처리방침</button>
        </div>
      </footer>
    </div>
  );
};

export default FoundersLabLanding;
