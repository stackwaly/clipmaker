// Configuração Cloudinary
const config = {
    cloudName: 'seu_cloud_name',
    uploadPreset: 'seu_upload_preset',
};

let viralMoments = [];
let filteredMoments = [];

// ===================================
// DRAG & DROP
// ===================================

function setupDragDrop() {
    const uploadBtn = document.getElementById('upload_widget');

    uploadBtn.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBtn.classList.add('upload-drag-over');
    });

    uploadBtn.addEventListener('dragleave', () => {
        uploadBtn.classList.remove('upload-drag-over');
    });

    uploadBtn.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBtn.classList.remove('upload-drag-over');
        uploadBtn.click();
    });
}

// ===================================
// INICIALIZAR CLOUDINARY
// ===================================

function initCloudinaryWidget() {
    if (!window.cloudinary) {
        console.warn('Cloudinary ainda não foi carregada');
        return;
    }

    const myWidget = window.cloudinary.createUploadWidget(
        config,
        async (error, result) => {
            if (!error && result && result.event === 'success') {
                const videoUrl = result.info.secure_url;
                const publicId = result.info.public_id;

                console.log('✅ Vídeo enviado:', videoUrl);
                document.getElementById('videoUrl').value = videoUrl;
                showAlert('✅ Vídeo enviado com sucesso!', 'success');

                await waitForTranscription(publicId);
            }
        }
    );

    document.getElementById('upload_widget').addEventListener('click', function() {
        myWidget.open();
    });

    setupDragDrop();
}

// ===================================
// AGUARDAR TRANSCRIÇÃO
// ===================================

async function waitForTranscription(publicId) {
    const maxAttempts = 30;
    const delay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const url = `https://res.cloudinary.com/${config.cloudName}/raw/upload/v${Date.now()}/${publicId}.transcript`;

        try {
            console.log(`⏳ Tentativa ${attempt}/${maxAttempts}: Verificando transcrição...`);
            const response = await fetch(url);

            if (response.ok) {
                const transcription = await response.text();
                console.log('✅ Transcrição encontrada!');
                document.getElementById('transcription').value = transcription;
                showAlert('✅ Transcrição obtida automaticamente!', 'success');
                return true;
            }
        } catch (error) {
            console.log(`Tentativa ${attempt} falhou:`, error.message);
        }

        if (attempt < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    showAlert('⚠️ Transcrição não encontrada. Cole manualmente.', 'info');
    return false;
}

// ===================================
// FILTRAR POR VIRAL SCORE
// ===================================

function setupViralScoreFilter(moments) {
    const controlsDiv = document.querySelector('.controls-bar');

    controlsDiv.innerHTML = `
        <div class="filter-group">
            <span style="font-weight: 600; color: #333;">Filtrar:</span>
            <button class="filter-button active" data-filter="all">Todos (${moments.length})</button>
            <button class="filter-button" data-filter="high">🔥 Viral Alta (8+)</button>
            <button class="filter-button" data-filter="medium">⚡ Viral Média (6-7)</button>
            <button class="filter-button" data-filter="low">✨ Viral Baixa (<6)</button>
        </div>
    `;

    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;

            if (filter === 'all') {
                filteredMoments = [...viralMoments];
            } else if (filter === 'high') {
                filteredMoments = viralMoments.filter(m => m.viralScore >= 8);
            } else if (filter === 'medium') {
                filteredMoments = viralMoments.filter(m => m.viralScore >= 6 && m.viralScore < 8);
            } else if (filter === 'low') {
                filteredMoments = viralMoments.filter(m => m.viralScore < 6);
            }

            renderMomentCards(filteredMoments);
        });
    });
}

// ===================================
// RENDERIZAR CARDS DE MOMENTOS
// ===================================

function renderMomentCards(moments) {
    const momentsList = document.querySelector('.moments-list');

    if (moments.length === 0) {
        momentsList.innerHTML = '<div class="alert alert-info">Nenhum momento encontrado com este filtro.</div>';
        return;
    }

    let html = `<h2 class="results-title">🎯 Momentos Virais <span class="moment-counter">${moments.length}</span></h2>`;

    moments.forEach((moment, index) => {
        const duration = (moment.endTime - moment.startTime).toFixed(1);
        const viralLevel = moment.viralScore >= 8 ? '🔥' : moment.viralScore >= 6 ? '⚡' : '✨';
        const ratingPercentage = (moment.viralScore / 10) * 100;

        html += `
            <div class="moment-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h3>${viralLevel} Clip ${index + 1} - ${duration}s</h3>
                        <div class="moment-text">
                            "${moment.text}"
                            <button class="copy-button" title="Copiar" onclick="copyToClipboard('${moment.text.replace(/'/g, "\\'")}')">📋</button>
                        </div>
                    </div>
                </div>

                <div class="moment-meta">
                    <span class="badge">⏱️ ${moment.startTime.toFixed(1)}s - ${moment.endTime.toFixed(1)}s</span>
                    <span class="badge">📊 ${moment.reason}</span>
                    <span class="badge"><span class="viral-score">Score: ${moment.viralScore}/10</span></span>
                </div>

                <div class="viral-rating">
                    <div class="viral-rating-bar" style="width: ${ratingPercentage}%"></div>
                </div>

                <div class="duration-controls">
                    <label style="font-size: 0.85rem; color: #666;">Duração:</label>
                    <input type="number" class="duration-input" value="${duration}" min="5" max="60" data-moment-index="${index}">
                    <span style="font-size: 0.85rem; color: #666;">s</span>
                </div>
            </div>
        `;
    });

    momentsList.innerHTML = html;

    // Eventos dos inputs de duração
    document.querySelectorAll('.duration-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const idx = parseInt(e.target.dataset.momentIndex);
            const newDuration = parseFloat(e.target.value);
            const originalDuration = filteredMoments[idx].endTime - filteredMoments[idx].startTime;
            const diff = newDuration - originalDuration;

            filteredMoments[idx].endTime += diff;
            console.log(`⏱️ Duração ajustada para ${newDuration}s`);
            showAlert(`✅ Duração ajustada para ${newDuration}s`, 'success');
        });
    });
}

// ===================================
// COPY TO CLIPBOARD
// ===================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('✅ Copiadoem clipboard!', 'success');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

// ===================================
// ANALISAR MOMENTOS VIRAIS
// ===================================

document.getElementById('analyzeBtn').addEventListener('click', async function() {
    const transcription = document.getElementById('transcription').value.trim();
    const videoUrl = document.getElementById('videoUrl').value;

    if (!transcription) {
        showAlert('❌ Por favor, forneça uma transcrição!', 'error');
        return;
    }

    setLoading(true, '🤖 Analisando com IA para encontrar momentos virais...');
    updateStep(2);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                transcription,
                videoUrl,
                videoDuration: parseFloat(document.getElementById('videoDuration').value) || 0
            })
        });

        if (!response.ok) {
            throw new Error(`Erro na análise: ${response.statusText}`);
        }

        const data = await response.json();
        viralMoments = data.moments;
        filteredMoments = [...viralMoments];

        showAnalysisResults(data.moments);
        showAlert(`🎉 ${data.moments.length} momentos virais encontrados!`, 'success');

        updateStep(3);
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`❌ Erro ao analisar: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
});

// ===================================
// EXIBIR RESULTADOS DA ANÁLISE
// ===================================

function showAnalysisResults(moments) {
    const resultsDiv = document.getElementById('results');
    const analysisDiv = document.getElementById('analysisResults');

    if (moments.length === 0) {
        analysisDiv.innerHTML = '<div class="alert alert-info">Nenhum momento viral encontrado. Tente com uma transcrição maior.</div>';
        resultsDiv.classList.add('show');
        return;
    }

    let html = `
        <div class="moments-list">
            <div class="controls-bar"></div>
        </div>
    `;

    analysisDiv.innerHTML = html;
    setupViralScoreFilter(moments);
    renderMomentCards(moments);
    resultsDiv.classList.add('show');

    // Botão de gerar clips
    setTimeout(() => {
        const btnContainer = document.querySelector('.moments-list');
        const btnDiv = document.createElement('div');
        btnDiv.className = 'generate-button-wrapper';
        btnDiv.innerHTML = `
            <button type="button" id="generateBtn" class="btn-primary generate-button">
                🎬 Gerar ${filteredMoments.length} Clips
            </button>
        `;
        btnContainer.appendChild(btnDiv);

        document.getElementById('generateBtn').addEventListener('click', generateClips);
    }, 100);
}

// ===================================
// GERAR CLIPS
// ===================================

async function generateClips() {
    const videoUrl = document.getElementById('videoUrl').value;

    if (!videoUrl) {
        showAlert('❌ Por favor, envie um vídeo primeiro!', 'error');
        return;
    }

    setLoading(true, '🎞️ Gerando clips... Isso pode levar alguns minutos...');

    try {
        const response = await fetch('/api/generate-clips', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                videoUrl,
                moments: filteredMoments
            })
        });

        if (!response.ok) {
            throw new Error(`Erro ao gerar clips: ${response.statusText}`);
        }

        const data = await response.json();
        showClipsResults(data.clips);
        showAlert(`✅ ${data.clips.length} clips gerados com sucesso!`, 'success');
    } catch (error) {
        console.error('Erro:', error);
        showAlert(`❌ Erro ao gerar clips: ${error.message}`, 'error');
    } finally {
        setLoading(false);
    }
}

// ===================================
// EXIBIR RESULTADOS DOS CLIPS
// ===================================

function showClipsResults(clips) {
    const clipsDiv = document.getElementById('clipsResults');

    let html = '<div class="results-container"><h2 class="results-title">✅ Clips Gerados <span class="moment-counter">' + clips.length + '</span></h2>';

    clips.forEach((clip, index) => {
        html += `
            <div class="moment-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h3>📥 Clip ${clip.id} - ${clip.duration}s</h3>
                        <div class="moment-text">
                            "${clip.text}"
                            <button class="copy-button" onclick="copyToClipboard('${clip.text.replace(/'/g, "\\'")}')">📋</button>
                        </div>
                    </div>
                </div>

                <div class="moment-meta">
                    <span class="badge">⏱️ ${clip.duration}s</span>
                    <span class="badge">📊 ${clip.reason}</span>
                    <span class="badge"><span class="viral-score">Score: ${clip.viralScore}/10</span></span>
                </div>

                <div style="margin-top: 12px;">
                    <a href="${clip.path}" download="${clip.filename}"
                        class="btn-primary clip-download-link">
                        ⬇️ Baixar Clip
                    </a>
                </div>
            </div>
        `;
    });

    html += `
        <div class="clips-container">
            <p class="clips-message">
                🎉 Seus clips estão prontos! Suba no TikTok, Shorts ou Reels.
            </p>
            <button type="button" onclick="location.reload()" class="btn-secondary reset-button">
                🔄 Processar Novo Vídeo
            </button>
        </div>
    `;

    html += '</div>';
    clipsDiv.innerHTML = html;
}

// ===================================
// ALERTAS
// ===================================

function showAlert(message, type) {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;

    setTimeout(() => {
        alertDiv.innerHTML = '';
    }, 5000);
}

// ===================================
// LOADING
// ===================================

function setLoading(isLoading, text = 'Processando...') {
    const loading = document.getElementById('loading');
    const btn = document.getElementById('analyzeBtn');

    if (isLoading) {
        loading.style.display = 'block';
        document.getElementById('loadingText').textContent = text;
        btn.disabled = true;
    } else {
        loading.style.display = 'none';
        btn.disabled = false;
    }
}

// ===================================
// ATUALIZAR PASSOS
// ===================================

function updateStep(stepNumber) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        if (i <= stepNumber) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    }
}

// ===================================
// ATALHOS DE TECLADO
// ===================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter para analisar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn && !analyzeBtn.disabled) {
            analyzeBtn.click();
        }
    }
});

// ===================================
// INICIALIZAÇÃO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initCloudinaryWidget();
    console.log('✅ ClipMaker pronto com interações avançadas!');
    console.log('💡 Dicas:');
    console.log('  • Arraste um vídeo sobre o botão de upload (Drag & Drop)');
    console.log('  • Clique 📋 para copiar textos dos clips');
    console.log('  • Ajuste a duração dos clips nos inputs numéricos');
    console.log('  • Use os filtros para encontrar melhores momentos');
    console.log('  • Pressione Ctrl+Enter para analisar rapidamente');
});
