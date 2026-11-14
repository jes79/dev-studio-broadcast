const broadcast = {
  game: {
    id: 'simsang-delivery',
    title: '심상 배달',
    genre: '2D 픽셀 · 배달 액션',
    summary: '배달원 심상이 골목을 달리며 오늘의 주문을 완성하는 게임입니다.',
    progress: 32,
    repo: 'https://github.com/jes79/simsang-delivery'
  },
  next: {
    title: '코인 획득 구현',
    description: '플레이어가 코인을 먹으면 점수가 올라가고, 화면에 작은 효과가 나타나게 합니다.',
    date: '다음 방송 · 준비 중',
    type: 'GAMEPLAY'
  },
  logs: [
    { date: '2026.11.14', title: '방송국 첫 화면 설계', body: '게임 개발 과정을 방송처럼 보여 주는 기본 화면을 만들었습니다.', time: '오늘 · 기획' },
    { date: '2026.11.13', title: '플레이어 이동 구현', body: '키보드 입력으로 심상이 좌우로 움직이도록 연결했습니다.', time: '어제 · 제작' },
    { date: '2026.11.11', title: '게임 콘셉트 정리', body: '배달 액션 게임의 핵심 재미와 첫 번째 제작 범위를 정했습니다.', time: '11월 11일 · 기획' }
  ],
  channels: [
    { id: 'simsang-delivery', tag: 'NOW BUILDING', title: '심상 배달', body: '골목을 달리는 2D 배달 액션 게임', progress: '32%' },
    { tag: 'LECTURE', title: 'Unity 입문 교안', body: '기능을 직접 만들며 배우는 수업 자료', progress: '준비 중' },
    { tag: 'SHOWROOM', title: '작품 전시관', body: '완성한 게임과 작업물을 모아 보는 공간', progress: '아이디어' }
  ],
  conversations: [
    { speaker: '동해님', role: '결정', message: '개발 과정을 방송처럼 보여 주는 화면을 만들자.', time: '오늘 09:40', kind: 'human' },
    { speaker: 'AI 제작실', role: '정리', message: '첫 버전은 현재 게임, 진행률, 최근 기록, 다음 작업부터 보여 주겠습니다.', time: '오늘 09:42', kind: 'ai' },
    { speaker: '동해님', role: '다음 작업', message: '대화 섹션도 추가해 줘.', time: '방금 전', kind: 'human' }
  ]
}

const showroomWorks = [
  {
    id: 'simsang-delivery',
    title: '심상 배달',
    genre: '2D 픽셀 · 배달 액션',
    summary: '배달원 심상이 골목을 달리며 오늘의 주문을 완성하는 게임입니다.',
    status: '개발 중',
    statusDescription: '아직 개발 중인 작품입니다. 공개 작품으로 등록할 준비를 하고 있습니다.',
    videoUrl: null,
    repo: broadcast.game.repo
  }
]

const conversationKey = 'dev-studio-broadcast.conversations'
const loadConversationStore = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(conversationKey) || 'null')
    if (Array.isArray(saved)) return { [broadcast.game.id]: saved }
    if (saved && typeof saved === 'object') return saved
  } catch (error) {
    console.warn('저장된 대화를 불러오지 못했습니다.', error)
  }
  return { [broadcast.game.id]: broadcast.conversations }
}
const conversationStore = loadConversationStore()
if (!Array.isArray(conversationStore[broadcast.game.id])) conversationStore[broadcast.game.id] = broadcast.conversations
const getConversations = () => conversationStore[broadcast.game.id]
const saveConversations = () => {
  try {
    localStorage.setItem(conversationKey, JSON.stringify(conversationStore))
  } catch (error) {
    console.warn('대화를 저장하지 못했습니다.', error)
  }
}
saveConversations()
const $ = selector => document.querySelector(selector)
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
const sessionKey = 'dev-studio-broadcast.current-session'
const historyKey = 'dev-studio-broadcast.session-history'
const loadJson = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch { return fallback }
}
let currentSession = loadJson(sessionKey, null)
let sessionHistory = loadJson(historyKey, [])
if (!Array.isArray(sessionHistory)) sessionHistory = []
const saveSession = () => {
  if (currentSession) localStorage.setItem(sessionKey, JSON.stringify(currentSession))
  else localStorage.removeItem(sessionKey)
}
const saveHistory = () => localStorage.setItem(historyKey, JSON.stringify(sessionHistory))
const statusLabels = { ready: '준비', running: '진행 중', finished: '마감', completed: '완료', partial: '부분 완료', pending: '보류' }
const renderSessionHistory = () => {
  const list = $('#sessionHistoryList')
  if (!list) return
  $('#sessionHistoryStatus').textContent = `${sessionHistory.length}개의 방송`
  list.innerHTML = sessionHistory.length ? sessionHistory.slice(0, 6).map(item => `<article class="log-card session-log-card"><div class="log-date">${escapeHtml(item.date)}</div><h3>${escapeHtml(item.topic)}</h3><p><strong>${escapeHtml(statusLabels[item.completion] || item.completion)}</strong> · ${escapeHtml(item.result)}</p><small>다음 작업: ${escapeHtml(item.nextTask)}</small></article>`).join('') : '<article class="log-card"><h3>아직 저장된 방송이 없습니다</h3><p>오늘의 방송을 만들고 결과를 저장해 보세요.</p></article>'
}
const renderSession = () => {
  const sessionPanel = $('.on-air-session')
  const finishPanel = $('#broadcastFinish')
  if (!sessionPanel) return
  const hasSession = Boolean(currentSession)
  sessionPanel.hidden = !hasSession
  finishPanel.hidden = !hasSession || currentSession.status !== 'finished'
  if (!hasSession) return
  $('#sessionTopic').textContent = currentSession.topic
  $('#sessionGoal').textContent = currentSession.goal
  $('#sessionMeta').textContent = [currentSession.link ? `링크: ${currentSession.link}` : '', currentSession.duration ? `예상 시간: ${currentSession.duration}` : ''].filter(Boolean).join(' · ') || '오늘 방송 세션'
  $('#sessionState').textContent = statusLabels[currentSession.status] || '준비'
  $('#startBroadcast').hidden = currentSession.status !== 'ready'
  $('#finishBroadcast').hidden = currentSession.status !== 'running'
}

const renderLogs = (listSelector, statusSelector, logs, status) => {
  const list = $(listSelector)
  if (!list) return
  $(statusSelector).textContent = status
  list.innerHTML = logs.map(log => {
    const content = `<div class="log-date">${escapeHtml(log.date)}</div><h3>${escapeHtml(log.title)}</h3><p>${escapeHtml(log.body)}</p><small>${escapeHtml(log.time)}</small>`
    return log.url
      ? `<a class="log-card" href="${escapeHtml(log.url)}" target="_blank" rel="noreferrer">${content}</a>`
      : `<article class="log-card">${content}</article>`
  }).join('')
}

const recentLogs = [...broadcast.logs]
const renderDashboardData = () => {
  $('#gameGenre').textContent = broadcast.game.genre
  $('#gameTitle').textContent = broadcast.game.title
  $('#gameSummary').textContent = broadcast.game.summary
  $('#gameProgressText').textContent = `${broadcast.game.progress}%`
  $('#gameProgressBar').style.width = `${broadcast.game.progress}%`
  $('#nextTitle').textContent = broadcast.next.title
  $('#nextDescription').textContent = broadcast.next.description
  $('#nextDate').textContent = broadcast.next.date
  $('#nextType').textContent = broadcast.next.type
  const hasWorkUrl = Boolean(broadcast.game.repo)
  $('#playVideo').hidden = !hasWorkUrl
  $('#openRepo').hidden = !hasWorkUrl
  renderSessionHistory()
  renderLogs('#logList', '#logStatus', recentLogs, `${recentLogs.length}개의 기록`)
}

const renderChannelData = () => {
  $('#channelGenre').textContent = broadcast.game.genre
  $('#channelTitle').textContent = broadcast.game.title
  $('#channelSummary').textContent = broadcast.game.summary
  $('#channelProgressText').textContent = `${broadcast.game.progress}%`
  $('#channelProgressBar').style.width = `${broadcast.game.progress}%`
  $('#channelNextTitle').textContent = broadcast.next.title
  $('#channelNextDescription').textContent = broadcast.next.description
  $('#channelNextDate').textContent = broadcast.next.date
  $('#channelNextType').textContent = broadcast.next.type
  renderLogs('#channelLogList', '#channelLogStatus', recentLogs, `${recentLogs.length}개의 기록`)
  const repoLink = $('#channelRepo')
  if (broadcast.game.repo) {
    repoLink.href = broadcast.game.repo
    repoLink.hidden = false
  } else {
    repoLink.removeAttribute('href')
    repoLink.hidden = true
  }
}
const bindBroadcastControls = () => {
  $('#broadcastForm').addEventListener('submit', event => {
    event.preventDefault()
    const topic = $('#broadcastTopic').value.trim()
    const goal = $('#broadcastGoal').value.trim()
    const error = $('#broadcastFormError')
    if (!topic || !goal) {
      error.textContent = '방송 주제와 오늘 끝낼 목표를 입력해 주세요.'
      error.hidden = false
      return
    }
    error.hidden = true
    currentSession = {
      id: Date.now().toString(),
      topic,
      goal,
      link: $('#broadcastLink').value.trim(),
      duration: $('#broadcastDuration').value.trim(),
      status: 'ready',
      createdAt: Date.now()
    }
    saveSession()
    window.location.hash = '#/on-air'
  })
  $('#startBroadcast').addEventListener('click', () => {
    if (!currentSession) return
    currentSession.status = 'running'
    currentSession.startedAt = Date.now()
    saveSession()
    renderSession()
  })
  $('#finishBroadcast').addEventListener('click', () => {
    if (!currentSession) return
    currentSession.status = 'finished'
    saveSession()
    renderSession()
  })
  $('#finishForm').addEventListener('submit', event => {
    event.preventDefault()
    const result = $('#resultText').value.trim()
    const nextTask = $('#nextTask').value.trim()
    const error = $('#finishFormError')
    if (!result || !nextTask) {
      error.textContent = '결과와 다음 작업을 입력해 주세요.'
      error.hidden = false
      return
    }
    const completion = document.querySelector('input[name="completion"]:checked').value
    sessionHistory.unshift({ ...currentSession, result, nextTask, completion, date: new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()).replaceAll(' ', '') })
    saveHistory()
    currentSession = null
    saveSession()
    resetTimer()
    renderSessionHistory()
    window.location.hash = '#/dashboard'
  })
}

const renderChannels = () => {
  $('#channelList').innerHTML = broadcast.channels.map(channel => {
    const content = `<div class="channel-tag">${escapeHtml(channel.tag)}</div><h3>${escapeHtml(channel.title)}</h3><p>${escapeHtml(channel.body)}</p><div class="channel-footer"><span>진행 상태</span><strong>${escapeHtml(channel.progress)}</strong></div>`
    if (channel.tag === 'SHOWROOM') return `<a class="channel-card linked" href="#/showroom">${content}</a>`
    return channel.id
      ? `<a class="channel-card linked" href="#/channel/${escapeHtml(channel.id)}">${content}</a>`
      : `<article class="channel-card">${content}</article>`
  }).join('')
}
const renderShowroom = (workId = showroomWorks[0].id) => {
  const work = showroomWorks.find(item => item.id === workId) || showroomWorks[0]
  $('#showroomList').innerHTML = showroomWorks.map(item => {
    const selected = item.id === work.id ? ' showroom-card-selected' : ''
    return `<a class="showroom-card${selected}" href="#/showroom/${escapeHtml(item.id)}"><div class="channel-tag">PUBLIC WORK · ${escapeHtml(item.status)}</div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p><div class="showroom-card-footer"><span>작품 상태</span><strong>${escapeHtml(item.status)}</strong></div></a>`
  }).join('')
  $('#showroomStatus').textContent = `${showroomWorks.length}개의 작품`
  $('#showroomDetailTitle').textContent = work.title
  $('#showroomDetailGenre').textContent = work.genre
  $('#showroomDetailSummary').textContent = work.summary
  $('#showroomDetailStatus').textContent = work.statusDescription
  const videoStatus = $('#showroomVideoStatus')
  videoStatus.innerHTML = work.videoUrl ? `<a href="${escapeHtml(work.videoUrl)}" target="_blank" rel="noreferrer">영상 보기</a>` : '영상 주소 없음'
  videoStatus.classList.toggle('status-ready', Boolean(work.videoUrl))
  $('#showroomVideoNote').textContent = work.videoUrl ? '등록된 영상으로 연결할 수 있습니다.' : '아직 실제 영상 주소가 등록되지 않았습니다. 영상이 준비되면 이곳에 연결됩니다.'
  const repoLink = $('#showroomRepo')
  if (work.repo) {
    repoLink.href = work.repo
    repoLink.hidden = false
  } else {
    repoLink.removeAttribute('href')
    repoLink.hidden = true
  }
  $('#showroomChannel').href = `#/channel/${work.id}`
}
const timerStorageKey = 'dev-studio-broadcast.on-air-timer'
const loadTimerState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(timerStorageKey) || '{}')
    return {
      elapsedMs: Number.isFinite(saved.elapsedMs) && saved.elapsedMs >= 0 ? saved.elapsedMs : 0,
      running: saved.running === true,
      startedAt: Number.isFinite(saved.startedAt) ? saved.startedAt : null
    }
  } catch {
    return { elapsedMs: 0, running: false, startedAt: null }
  }
}
const timerState = loadTimerState()
let timerInterval = null
const getElapsedMs = () => timerState.running && timerState.startedAt
  ? timerState.elapsedMs + Math.max(0, Date.now() - timerState.startedAt)
  : timerState.elapsedMs
const formatTimer = milliseconds => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':')
}
const saveTimerState = () => {
  localStorage.setItem(timerStorageKey, JSON.stringify(timerState))
}
const renderTimer = () => {
  const display = $('#onAirTimerDisplay')
  if (!display) return
  display.textContent = formatTimer(getElapsedMs())
  const status = $('#onAirStatusLabel')
  if (status) status.textContent = timerState.running ? '준비 중' : timerState.elapsedMs ? '일시정지' : '방송 준비'
  const startButton = $('#onAirTimerStart')
  const pauseButton = $('#onAirTimerPause')
  if (startButton) startButton.disabled = timerState.running
  if (pauseButton) pauseButton.disabled = !timerState.running
}
const stopTimerInterval = () => {
  if (timerInterval !== null) {
    window.clearInterval(timerInterval)
    timerInterval = null
  }
}
const startTimerInterval = () => {
  stopTimerInterval()
  if (timerState.running && window.location.hash === '#/on-air') timerInterval = window.setInterval(renderTimer, 1000)
}
const startTimer = () => {
  if (timerState.running) return
  timerState.startedAt = Date.now()
  timerState.running = true
  saveTimerState()
  renderTimer()
  startTimerInterval()
}
const pauseTimer = () => {
  if (!timerState.running) return
  timerState.elapsedMs = getElapsedMs()
  timerState.startedAt = null
  timerState.running = false
  saveTimerState()
  stopTimerInterval()
  renderTimer()
}
const resetTimer = () => {
  timerState.elapsedMs = 0
  timerState.startedAt = null
  timerState.running = false
  saveTimerState()
  stopTimerInterval()
  renderTimer()
}
const bindTimerControls = () => {
  $('#onAirTimerStart').addEventListener('click', startTimer)
  $('#onAirTimerPause').addEventListener('click', pauseTimer)
  $('#onAirTimerReset').addEventListener('click', resetTimer)
}

const hostLines = [
  '안녕하세요! 동해숭이 방송국입니다. 곧 방송을 시작할게요.',
  '오늘도 게임을 만들고, 만든 과정을 함께 기록해 볼까요?',
  '잠시 후 개발 방송을 시작합니다. 편하게 구경해 주세요.',
  '방송이 끝나면 오늘 만든 내용을 개발 기록으로 남길게요.'
]
let hostLineIndex = 0
const renderHostLine = () => {
  $('#hostSpeech').textContent = hostLines[hostLineIndex]
}
const showNextHostLine = () => {
  hostLineIndex = (hostLineIndex + 1) % hostLines.length
  renderHostLine()
}
const renderOnAir = () => {
  $('#onAirGenre').textContent = broadcast.game.genre
  $('#onAirTitle').textContent = broadcast.game.title
  $('#onAirSummary').textContent = broadcast.game.summary
  $('#onAirProgressText').textContent = `${broadcast.game.progress}%`
  $('#onAirProgressBar').style.width = `${broadcast.game.progress}%`
  $('#onAirNextTitle').textContent = broadcast.next.title
  $('#onAirNextDescription').textContent = broadcast.next.description
  $('#onAirNextDate').textContent = broadcast.next.date
  $('#onAirNextType').textContent = broadcast.next.type
  renderLogs('#onAirLogList', '#onAirLogStatus', recentLogs.slice(0, 3), `${Math.min(recentLogs.length, 3)}개의 기록`)
  renderSession()
  renderTimer()
}





const renderConversations = (listSelector, countSelector) => {
  const conversations = getConversations()
  $(countSelector).textContent = `${conversations.length}개의 대화`
  $(listSelector).innerHTML = conversations.map(item => `<article class="conversation-item ${item.kind}"><div class="conversation-avatar">${item.kind === 'ai' ? 'AI' : '동'}</div><div><div class="conversation-meta"><strong>${escapeHtml(item.speaker)} · ${escapeHtml(item.role)}</strong><time>${escapeHtml(item.time)}</time></div><p>${escapeHtml(item.message)}</p></div></article>`).join('')
}

const bindConversationForm = (formSelector, inputSelector, listSelector, countSelector) => {
  $(formSelector).addEventListener('submit', event => {
    event.preventDefault()
    const input = $(inputSelector)
    const message = input.value.trim()
    if (!message) return
    getConversations().push({ speaker: '동해님', role: '새 기록', message, time: '방금 전', kind: 'human' })
    saveConversations()
    input.value = ''
    renderConversations(listSelector, countSelector)
    if (formSelector === '#dashboardConversationForm') renderConversations('#channelConversationList', '#channelConversationCount')
    if (formSelector === '#channelConversationForm') renderConversations('#conversationList', '#conversationCount')
  })
}

const renderRoute = () => {
  const channelRoute = `#/channel/${broadcast.game.id}`
  const hash = window.location.hash
  const showroomId = hash.split('/')[2]
  const isChannel = hash === channelRoute
  const isShowroom = hash === '#/showroom' || (hash.startsWith('#/showroom/') && showroomWorks.some(work => work.id === showroomId))
  const isOnAir = hash === '#/on-air'
  if (hash.startsWith('#/showroom/') && !isShowroom) {
    window.location.hash = '#/dashboard'
    return
  }
  $('#dashboardView').hidden = isChannel || isShowroom || isOnAir
  $('#channelView').hidden = !isChannel
  $('#showroomView').hidden = !isShowroom
  $('#onAirView').hidden = !isOnAir
  if (isShowroom) renderShowroom(showroomId || showroomWorks[0].id)
  if (isOnAir) {
    renderOnAir()
    startTimerInterval()
  } else {
    stopTimerInterval()
  }
  document.title = isChannel
    ? `${broadcast.game.title} · Dev Studio Broadcast`
    : isShowroom ? '작품 전시관 · Dev Studio Broadcast'
      : isOnAir ? '녹화 준비 화면 · Dev Studio Broadcast' : 'Dev Studio Broadcast'
}

renderDashboardData()
renderChannelData()
renderChannels()
renderConversations('#conversationList', '#conversationCount')
renderShowroom()
renderConversations('#channelConversationList', '#channelConversationCount')
bindConversationForm('#dashboardConversationForm', '#conversationInput', '#conversationList', '#conversationCount')
bindConversationForm('#channelConversationForm', '#channelConversationInput', '#channelConversationList', '#channelConversationCount')
bindTimerControls()
bindBroadcastControls()
$('#hostNextLine').addEventListener('click', showNextHostLine)

const githubCommitsUrl = 'https://api.github.com/repos/jes79/dev-studio-broadcast/commits?per_page=3'
const formatCommitDate = value => new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(value)).replaceAll(' ', '')
const loadRecentCommits = async () => {
  try {
    const response = await fetch(githubCommitsUrl, { headers: { Accept: 'application/vnd.github+json' } })
    if (!response.ok) throw new Error(`GitHub 응답 ${response.status}`)
    const commits = await response.json()
    const logs = commits.slice(0, 3).map(commit => ({
      date: formatCommitDate(commit.commit.author.date),
      title: commit.commit.message.split('\n')[0],
      body: `${commit.commit.author.name} · GitHub 커밋`,
      time: 'GitHub에서 불러옴',
      url: commit.html_url
    }))
    if (!logs.length) throw new Error('커밋 없음')
    recentLogs.splice(0, recentLogs.length, ...logs)
    renderLogs('#logList', '#logStatus', recentLogs, `GitHub 최근 ${logs.length}개`)
    renderLogs('#channelLogList', '#channelLogStatus', recentLogs, `GitHub 최근 ${logs.length}개`)
    renderLogs('#onAirLogList', '#onAirLogStatus', recentLogs.slice(0, 3), `GitHub 최근 ${Math.min(logs.length, 3)}개`)
  } catch (error) {
    $('#logStatus').textContent = '샘플 기록 · GitHub 연결 대기'
    $('#channelLogStatus').textContent = '샘플 기록 · GitHub 연결 대기'
    $('#onAirLogStatus').textContent = '샘플 기록 · GitHub 연결 대기'
    console.warn('GitHub 커밋을 불러오지 못했습니다.', error)
  }
}

$('#playVideo').addEventListener('click', () => {
  if (broadcast.game.repo) window.open(broadcast.game.repo, '_blank', 'noopener,noreferrer')
})
$('#openRepo').addEventListener('click', () => {
  if (broadcast.game.repo) window.open(broadcast.game.repo, '_blank', 'noopener,noreferrer')
})
$('#showAll').addEventListener('click', () => {
  window.location.hash = '#/showroom'
})
$('#backToDashboard').addEventListener('click', () => {
  window.location.hash = '#/dashboard'
})
window.addEventListener('hashchange', renderRoute)
renderRoute()
loadRecentCommits()
