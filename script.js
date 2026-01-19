// フリーランスポートフォリオ カスタムJavaScript

document.addEventListener('DOMContentLoaded', function() {
    // スムーズスクロールの実装
    initSmoothScroll();

    // アクティブなナビゲーションリンクのハイライト
    initActiveNavHighlight();

    // お問い合わせフォームの処理
    initContactForm();

    // スクロール時のヘッダー効果
    initScrollHeaderEffect();

    // アニメーションのトリガー
    initAnimations();

    // プロジェクト詳細モーダル
    initProjectModals();
});

/**
 * スムーズスクロールの初期化
 */
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // ページ内リンクのみ処理
            if (href === '#' || href === '#top') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // モバイルメニューを閉じる（もしあれば）
                    closeMobileMenu();
                }
            }
        });
    });
}

/**
 * アクティブなナビゲーションリンクのハイライト
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');

            if (href === `#${currentSectionId}` || (currentSectionId === 'top' && (href === '#' || href === '#top'))) {
                link.classList.add('active');
            }
        });
    }

    // 初期状態とスクロール時にハイライトを更新
    highlightNavLink();
    window.addEventListener('scroll', highlightNavLink);
}

/**
 * お問い合わせフォームの処理
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // フォームデータの取得
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());

        // 簡単なバリデーション
        if (!formValues.name || !formValues.email || !formValues.subject || !formValues.message) {
            showAlert('すべての項目を入力してください。', 'error');
            return;
        }

        if (!isValidEmail(formValues.email)) {
            showAlert('有効なメールアドレスを入力してください。', 'error');
            return;
        }

        // 送信処理のシミュレーション
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>送信中...';
        submitBtn.disabled = true;

        // 実際のアプリケーションではここでAPIリクエストを送信
        setTimeout(() => {
            showAlert('お問い合わせ内容を送信しました。24時間以内にご返信いたします。', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/**
 * スクロール時のヘッダー効果
 */
function initScrollHeaderEffect() {
    const header = document.querySelector('header');

    if (!header) return;

    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('shadow-md');
            header.classList.remove('shadow-sm');
        } else {
            header.classList.remove('shadow-md');
            header.classList.add('shadow-sm');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader);
}

/**
 * アニメーションのトリガー
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.card, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * プロジェクト詳細モーダル
 */
function initProjectModals() {
    const detailButtons = document.querySelectorAll('.card-actions .btn-ghost');

    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.card');
            const title = card.querySelector('.card-title').textContent;
            const description = card.querySelector('p').textContent;
            const badges = Array.from(card.querySelectorAll('.badge')).map(badge => badge.textContent);

            showProjectModal(title, description, badges);
        });
    });
}

/**
 * プロジェクト詳細モーダルを表示
 */
function showProjectModal(title, description, technologies) {
    // モーダルが既に存在する場合は削除
    const existingModal = document.getElementById('project-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // モーダルを作成
    const modal = document.createElement('div');
    modal.id = 'project-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50';
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex justify-between items-start mb-6">
                    <h3 class="text-2xl font-bold">${title}</h3>
                    <button id="close-modal" class="btn btn-ghost btn-circle">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="mb-6">
                    <h4 class="font-bold text-lg mb-2">プロジェクト概要</h4>
                    <p class="text-gray-600">${description}</p>
                </div>

                <div class="mb-6">
                    <h4 class="font-bold text-lg mb-2">使用技術</h4>
                    <div class="flex flex-wrap gap-2">
                        ${technologies.map(tech => `<span class="badge badge-primary text-white">${tech}</span>`).join('')}
                    </div>
                </div>

                <div class="mb-6">
                    <h4 class="font-bold text-lg mb-2">担当範囲</h4>
                    <ul class="list-disc pl-5 text-gray-600 space-y-1">
                        <li>要件定義・設計</li>
                        <li>フロントエンド/バックエンド開発</li>
                        <li>テスト・デバッグ</li>
                        <li>デプロイ・保守</li>
                    </ul>
                </div>

                <div class="flex justify-end space-x-4">
                    <button id="modal-close-btn" class="btn btn-ghost">閉じる</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // モーダルを閉じるイベント
    const closeButtons = modal.querySelectorAll('#close-modal, #modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
        });
    });

    // モーダル外をクリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * アラートを表示
 */
function showAlert(message, type = 'info') {
    // 既存のアラートを削除
    const existingAlert = document.getElementById('custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.id = 'custom-alert';
    alert.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-transform duration-300 translate-x-full`;

    let bgColor = 'bg-blue-100 text-blue-800';
    let icon = 'info-circle';

    if (type === 'success') {
        bgColor = 'bg-green-100 text-green-800';
        icon = 'check-circle';
    } else if (type === 'error') {
        bgColor = 'bg-red-100 text-red-800';
        icon = 'exclamation-circle';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-100 text-yellow-800';
        icon = 'exclamation-triangle';
    }

    alert.innerHTML = `
        <div class="flex items-start ${bgColor} p-4 rounded-lg">
            <i class="fas fa-${icon} text-xl mr-3 mt-0.5"></i>
            <div class="flex-1">
                <p class="font-medium">${message}</p>
            </div>
            <button id="close-alert" class="ml-4 text-xl">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    document.body.appendChild(alert);

    // アニメーションで表示
    setTimeout(() => {
        alert.classList.remove('translate-x-full');
        alert.classList.add('translate-x-0');
    }, 10);

    // 閉じるボタン
    const closeBtn = alert.querySelector('#close-alert');
    closeBtn.addEventListener('click', () => {
        alert.classList.remove('translate-x-0');
        alert.classList.add('translate-x-full');
        setTimeout(() => {
            alert.remove();
        }, 300);
    });

    // 5秒後に自動的に閉じる
    setTimeout(() => {
        if (alert.parentNode) {
            alert.classList.remove('translate-x-0');
            alert.classList.add('translate-x-full');
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 300);
        }
    }, 5000);
}

/**
 * メールアドレスのバリデーション
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * モバイルメニューを閉じる（将来的な拡張用）
 */
function closeMobileMenu() {
    // モバイルメニューが実装された場合に使用
}

/**
 * 現在の年をフッターに表示
 */
function updateCurrentYear() {
    const yearElement = document.querySelector('footer p.text-sm');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = yearElement.textContent.replace('2023', currentYear);
    }
}

// 現在の年を更新
updateCurrentYear();
