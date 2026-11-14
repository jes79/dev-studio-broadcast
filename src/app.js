const broadcast = {
  game: { title: '심상 배달', genre: '2D 픽셀 · 배달 액션', summary: '배달원 심상이 골목을 달리며 오늘의 주문을 완성하는 게임입니다.', progress: 32, video: 'https://github.com/jes79/simsang-delivery', repo: 'https://github.com/jes79/simsang-delivery' },
  next: { title: '코인 획득 구현', description: '플레이어가 코인을 먹으면 점수가 올라가고, 화면에 작은 효과가 나타나게 합니다.', date: '다음 방송 · 준비 중', type: 'GAMEPLAY' },
  logs: [
    { date: '2026.11.14', title: '방송국 첫 화면 설계', body: '게임 개발 과정을 방송처럼 보여 주는 기본 화면을 만들었습니다.', time: '오늘 · 기획' },
    { date: '2026.11.13', title: '플레이어 이동 구현', body: '키보드 입력으로 심상이 좌우로 움직이도록 연결했습니다.', time: '어제 · 제작' },
    { date: '2026.11.11', title: '게임 콘셉트 정리', body: '배달 액션 게임의 핵심 재미와 첫 번째 제작 범위를 정했습니다.', time: '11월 11일 · 기획' }
  ],
  channels: [
    { tag: 'NOW BUILDING', title: '심상 배달', body: '골목을 달리는 2D 배달 액션 게임', progress: '32%', url: 'https://github.com/jes79/simsang-delivery' },
    { tag: 'LECTURE', title: 'Unity 입문 교안', body: '기능을 직접 만들며 배우는 수업 자료', progress: '준비 중' },
    { tag: 'SHOWROOM', title: '작품 전시관', body: '완성한 게임과 작업물을 모아 보는 공간', progress: '아이디어' }
  ],
  conversations: [
    { speaker: '동해님', role: '결정', message: '개발 과정을 방송처럼 보여 주는 화면을 만들자.', time: '오늘 09:40', kind: 'human' },
    { speaker: 'AI 제작실', role: '정리', message: '첫 버전은 현재 게임, 진행률, 최근 기록, 다음 작업부터 보여 주겠습니다.', time: '오늘 09:42', kind: 'ai' },
    { speaker: '동해님', role: '다음 작업', message: '대화 섹션도 추가해 줘.', time: '방금 전', kind: 'human' }
  ]
}
const conversationKey = 'dev-studio-broadcast.conversations'
const savedConversations = JSON.parse(localStorage.getItem(conversationKey) || 'null')
if (Array.isArray(savedConversations)) broadcast.conversations = savedConversations
const $ = selector => document.querySelector(selector)
const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]))
$('#gameGenre').textContent = broadcast.game.genre
$('#gameTitle').textContent = broadcast.game.title
$('#gameSummary').textContent = broadcast.game.summary
$('#gameProgressText').textContent = `${broadcast.game.progress}%`
$('#gameProgressBar').style.width = `${broadcast.game.progress}%`
$('#nextTitle').textContent = broadcast.next.title
$('#nextDescription').textContent = broadcast.next.description
$('#nextDate').textContent = broadcast.next.date
$('#nextType').textContent = broadcast.next.type
const renderLogs = (logs, status) => {
  $('#logStatus').textContent = status
  $('#logList').innerHTML = logs.map(log => `<a class="log-card" href="${escapeHtml(log.url || '#')}"${log.url ? ' target="_blank" rel="noreferrer"' : ''}><div class="log-date">${escapeHtml(log.date)}</div><h3>${escapeHtml(log.title)}</h3><p>${escapeHtml(log.body)}</p><small>${escapeHtml(log.time)}</small></a>`).join('')
}
renderLogs(broadcast.logs, `${broadcast.logs.length}개의 기록`)
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
    renderLogs(logs, `GitHub 최근 ${logs.length}개`)
  } catch (error) {
    $('#logStatus').textContent = '샘플 기록 · GitHub 연결 대기'
    console.warn('GitHub 커밋을 불러오지 못했습니다.', error)
  }
}
loadRecentCommits()
const renderChannels = () => {
  $('#channelList').innerHTML = broadcast.channels.map(channel => `${channel.url ? `<a class="channel-card linked" href="${escapeHtml(channel.url)}" target="_blank" rel="noreferrer">` : '<article class="channel-card">'}<div class="channel-tag">${escapeHtml(channel.tag)}</div><h3>${escapeHtml(channel.title)}</h3><p>${escapeHtml(channel.body)}</p><div class="channel-footer"><span>진행 상태</span><strong>${escapeHtml(channel.progress)}</strong></div>${channel.url ? '</a>' : '</article>'}`).join('')
}
renderChannels()
const renderConversations = () => {
  $('#conversationCount').textContent = `${broadcast.conversations.length}개의 대화`
  $('#conversationList').innerHTML = broadcast.conversations.map(item => `<article class="conversation-item ${item.kind}"><div class="conversation-avatar">${item.kind === 'ai' ? 'AI' : '동'}</div><div><div class="conversation-meta"><strong>${escapeHtml(item.speaker)} · ${escapeHtml(item.role)}</strong><time>${escapeHtml(item.time)}</time></div><p>${escapeHtml(item.message)}</p></div></article>`).join('')
}
renderConversations()
$('#conversationForm').addEventListener('submit', event => {
  event.preventDefault()
  const input = $('#conversationInput')
  const message = input.value.trim()
  if (!message) return
  broadcast.conversations.push({ speaker: '동해님', role: '새 기록', message, time: '방금 전', kind: 'human' })
  localStorage.setItem(conversationKey, JSON.stringify(broadcast.conversations))
  input.value = ''
  renderConversations()
})
$('#playVideo').addEventListener('click', () => window.open(broadcast.game.video, '_blank'))
$('#openRepo').addEventListener('click', () => window.open(broadcast.game.repo, '_blank'))
