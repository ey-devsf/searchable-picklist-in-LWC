# Component Architecture

## システム構成図

```
┌─────────────────────────────────────────────────────────────┐
│                    Salesforce Organization                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Lightning App / Page                       │ │
│  │                                                         │ │
│  │  ┌──────────────────────────────────────────────────┐  │ │
│  │  │      searchablePicklistDemo (Demo Component)     │  │ │
│  │  │                                                   │  │ │
│  │  │  - Sample options data (20 fruits)              │  │ │
│  │  │  - Event handler for selection                   │  │ │
│  │  │  - Display selected option                       │  │ │
│  │  │                                                   │  │ │
│  │  │  ┌────────────────────────────────────────────┐  │  │ │
│  │  │  │    searchablePicklist (Main Component)     │  │  │ │
│  │  │  │                                            │  │  │ │
│  │  │  │  Input Parameters:                        │  │  │ │
│  │  │  │  • options          (required)            │  │  │ │
│  │  │  │  • initValue        (optional)            │  │  │ │
│  │  │  │  • initSearchValue  (optional)            │  │  │ │
│  │  │  │                                            │  │  │ │
│  │  │  │  UI Elements:                             │  │  │ │
│  │  │  │  ┌──────────────────────────────────┐    │  │  │ │
│  │  │  │  │  Search Input Box                │    │  │  │ │
│  │  │  │  │  - Real-time filtering           │    │  │  │ │
│  │  │  │  │  - Keyboard navigation           │    │  │  │ │
│  │  │  │  └──────────────────────────────────┘    │  │  │ │
│  │  │  │                                            │  │  │ │
│  │  │  │  ┌──────────────────────────────────┐    │  │  │ │
│  │  │  │  │  Dropdown List (conditional)     │    │  │  │ │
│  │  │  │  │  - Filtered options display      │    │  │  │ │
│  │  │  │  │  - Keyboard navigation           │    │  │  │ │
│  │  │  │  │  - Click/Enter selection         │    │  │  │ │
│  │  │  │  └──────────────────────────────────┘    │  │  │ │
│  │  │  │                                            │  │  │ │
│  │  │  │  Output:                                  │  │  │ │
│  │  │  │  • optionselected event                  │  │  │ │
│  │  │  │  • getInputText() method                 │  │  │ │
│  │  │  │  • getSelectedOption() method            │  │  │ │
│  │  │  └────────────────────────────────────────────┘  │  │ │
│  │  └──────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## コンポーネント間のデータフロー

```
Parent Component (searchablePicklistDemo)
    │
    ├─> options: Array [{label, value, ...}]  ──┐
    ├─> initValue: String (optional)           ─┤
    ├─> initSearchValue: String (optional)     ─┤
    │                                            │
    │                                            ↓
    │                              searchablePicklist Component
    │                                            │
    │                                            │ User Interaction
    │                                            │ (search, select)
    │                                            │
    │                                            ↓
    ├─< optionselected event                    │
    │   {                                        │
    │     selectedOption: Object                 │
    │     inputText: String                      │
    │   }                                        │
    │                                            │
    └─< getInputText() / getSelectedOption() ───┘
```

## ファイル構成

```
searchable-picklist-in-LWC/
├── README.md                          # プロジェクト概要・クイックスタート
├── IMPLEMENTATION_SUMMARY.md          # 実装サマリー・要件対応表
├── COMPONENT_ARCHITECTURE.md          # このファイル（アーキテクチャ説明）
├── requirements_definition/
│   └── base_requirements.md           # 要件定義書
└── force-app/main/default/lwc/
    ├── searchablePicklist/            # メインコンポーネント
    │   ├── searchablePicklist.html    # テンプレート (45行)
    │   ├── searchablePicklist.js      # コントローラー (194行)
    │   ├── searchablePicklist.css     # スタイル (68行)
    │   ├── searchablePicklist.js-meta.xml  # メタデータ
    │   └── README.md                  # コンポーネント詳細仕様 (150行)
    └── searchablePicklistDemo/        # デモコンポーネント
        ├── searchablePicklistDemo.html     # テンプレート (34行)
        ├── searchablePicklistDemo.js       # コントローラー (39行)
        ├── searchablePicklistDemo.css      # スタイル (4行)
        └── searchablePicklistDemo.js-meta.xml  # メタデータ
```

## 主要な機能フロー

### 1. 初期化フロー

```
connectedCallback()
    │
    ├─> initSearchValue が設定されている？
    │   └─> Yes: inputText に設定 & filterOptions()
    │
    └─> initValue が設定されている？
        └─> Yes: options から該当項目を検索
            └─> 見つかった: selectedOption に設定 & inputText に label を設定
```

### 2. 検索・フィルタリングフロー

```
User types in search box
    │
    ↓
handleInputChange(event)
    │
    ├─> inputText を更新
    ├─> filterOptions() を呼び出し
    │   │
    │   └─> inputText.toLowerCase() で検索
    │       └─> option.label に部分一致する項目を抽出
    │
    └─> showDropdown = true
        │
        └─> Dropdown を表示（filteredOptions をレンダリング）
```

### 3. 選択フロー

```
User clicks option OR presses Enter
    │
    ↓
selectOption(option)
    │
    ├─> selectedOption = option
    ├─> inputText = option.label
    ├─> showDropdown = false
    ├─> フォーカスを search input に戻す
    │
    └─> optionselected イベントを発火
        │
        └─> Parent component が受け取る
            └─> handleOptionSelected(event)
```

### 4. キーボードナビゲーションフロー

```
Search Input でキー押下
    │
    ├─> Tab または ↓
    │   └─> 最初の option にフォーカス移動
    │
    ├─> Enter
    │   └─> filteredOptions が1件のみ？
    │       └─> Yes: その option を選択
    │
    └─> Escape
        └─> Dropdown を閉じる

Option List でキー押下
    │
    ├─> Enter
    │   └─> フォーカス中の option を選択
    │
    ├─> ↑
    │   ├─> 前の option へ
    │   └─> 最上位？ → Search Input へ
    │
    ├─> ↓
    │   ├─> 次の option へ
    │   └─> 最下位？ → Search Input へ
    │
    ├─> Tab
    │   ├─> 次の option へ
    │   └─> 最下位？ → Search Input へ
    │
    └─> Escape
        └─> Dropdown を閉じて Search Input へフォーカス
```

### 5. Blur（フォーカスアウト）フロー

```
Search Input から focus out
    │
    ↓
handleBlur(event)
    │
    └─> 150ms 待機（relatedTarget を取得するため）
        │
        ├─> Dropdown 内の要素にフォーカスが移った？
        │   └─> Yes: 何もしない
        │
        └─> No: Dropdown 外にフォーカスが移った
            │
            ├─> filteredOptions を確認
            │   └─> inputText と完全一致する option が1件のみ？
            │       └─> Yes: その option を自動選択
            │
            └─> showDropdown = false
```

## 技術スタック

| Layer | Technology |
|-------|-----------|
| Framework | Lightning Web Components (LWC) |
| Template | HTML5 (標準タグのみ、lightning-input 不使用) |
| Script | JavaScript (ES6+) |
| Style | CSS3 |
| Metadata | XML (Salesforce metadata API) |
| API Version | 64.0 |

## 主要な技術的特徴

1. **Reactive Properties**: `@track` デコレータで状態管理
2. **Public API**: `@api` デコレータで外部公開プロパティ/メソッド
3. **Custom Events**: `optionselected` で親コンポーネントへ通知
4. **Keyboard Accessibility**: 完全なキーボード操作対応
5. **Focus Management**: `relatedTarget` を使用した精密なフォーカス管理
6. **Responsive Design**: 可変幅・最大高さ設定でスクロール対応
7. **Performance**: 配列フィルタリングで高速検索（800項目対応）

## アクセシビリティ対応

- ✅ キーボードのみでの完全操作
- ✅ Tab キーによる順次フォーカス移動
- ✅ 矢印キーによる選択肢移動
- ✅ Enter/Escape キーによる操作
- ✅ フォーカス表示（CSS :focus）
- 🔄 今後の改善: ARIA属性の追加（role, aria-label, aria-expanded など）

## ブラウザ互換性

Lightning Web Components の動作環境に準拠：
- ✅ Chrome (最新版)
- ✅ Firefox (最新版)
- ✅ Safari (最新版)
- ✅ Edge (最新版)
- ✅ モバイルブラウザ（iOS Safari, Chrome）

## デプロイメント

```bash
# 1. Salesforce CLI で認証
sfdx auth:web:login -a myOrg

# 2. コンポーネントをデプロイ
sfdx force:source:deploy -p force-app/main/default/lwc -u myOrg

# 3. Lightning App Builder で使用
# - 任意のページを編集
# - カスタムコンポーネントから追加
```

## パフォーマンス考慮事項

| 項目 | 実装 | 効果 |
|------|------|------|
| フィルタリング | JavaScript Array.filter() | O(n) で高速検索 |
| レンダリング | for:each による差分レンダリング | 変更箇所のみ更新 |
| イベント処理 | setTimeout での blur 遅延 | 不要な再レンダリング防止 |
| スタイル | CSS のみ、JS DOM 操作最小限 | 高速な UI 更新 |

## セキュリティ考慮事項

- ✅ XSS対策: LWC の自動エスケープ機能
- ✅ データバインディング: リアクティブプロパティによる安全な更新
- ✅ イベント: カスタムイベントによる制御されたデータフロー
