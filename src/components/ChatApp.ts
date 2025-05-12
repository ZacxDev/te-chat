import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

@customElement('te-chat-app')
export class TEChatApp extends LitElement {

  createRenderRoot() {
    return this
  }

  @state()
  private messages: ChatMessage[] = [];

  @state()
  private input: string = '';

  private socket?: WebSocket;

  connectedCallback() {
    super.connectedCallback();
    this.connectSocket();
  }

  connectSocket() {
    const ws = new WebSocket(`ws://192.168.50.94:8000/ws`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data) as ChatMessage;
      this.messages = [...this.messages.filter(m => !m.id || m.id !== msg.id), msg]
      this.scrollToBottom();
      this.requestUpdate();
    };
    ws.onclose = () => {
      console.warn('Socket closed, attempting reconnect in 2s');
      setTimeout(() => this.connectSocket(), 2000);
    };
    this.socket = ws;
  }

  private scrollToBottom() {
    this.updateComplete.then(() => {
      const chat = this.shadowRoot?.querySelector('.chat');
      if (chat) chat.scrollTop = chat.scrollHeight;
    });
  }

  private sendMessage(e: Event) {
    e.preventDefault();
    if (!this.input.trim() || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(this.input.trim());
    this.input = '';
  }

  private quickPrompt(topic: string) {
    const prompt = this.quickPromptMapping[topic];
    if (!prompt || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(prompt);
  }

  private quickPromptMapping: Record<string, string> = {
    'Mexico GDP': 'What is the latest GDP growth data for Mexico, and how does it compare to previous quarters?',
    'Earnings Reports': 'Can you provide a summary of recent major corporate earnings reports out of Mexico?',
    'Macro Trends': 'What are the key global macroeconomic trends investors should be aware of this month?',
  };

  render() {
    return html`
      <div class="flex flex-col h-screen">
        <header class="navbar bg-base-200 shadow">
          <div class="flex-1 px-4 text-xl font-semibold">TradingEconomics Chat</div>
        </header>

        <div class="h-full flex justify-end flex-col bg-base-100">
          <div class="messages space-y-4 max-h-full overflow-y-auto">
            ${this.messages.map(
      (m) => {
        const isUnclosedThink = /<think\b[^>]*>([^<]*)$/gs.test(m.content);
        const cleanContent = m.content.replace(/<think\b[^>]*>(.*?)<\/think>|<think\b[^>]*>([^<]*)$/gs, '').trim()
        const htmlContent = marked.parse(cleanContent, { async: false }); // Convert markdown to HTML

        return html`
                    <div class="chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}">
                      <div class="chat-bubble ${m.role === 'user' ? 'bg-accent text-neutral' : 'bg-base-300 text-base-content'}">
                        ${unsafeHTML(htmlContent)}
                      </div>
                      ${isUnclosedThink && m.role !== 'user' ? html`
                          <div class="chat-bubble bg-base-200 text-base-content animate-pulse">
                            Thinking<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span>
                          </div>
                        `
            : ''}
                    </div>
                  `
      }
    )
      }
                    <div class="chat chat-start">
                      ${this.messages.length === 1 ? html`
                          <div class="chat-bubble bg-base-200 text-base-content animate-pulse">
                            Thinking<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span>
                          </div>`
                          : null}
          </div>

          <div class="flex flex-wrap gap-2 p-2 bg-base-200 border-t">
              ${Object.keys(this.quickPromptMapping).map(topic => html`
    <button class="btn btn-sm btn-accent" @click=${() => this.quickPrompt(topic)}>${topic}</button>
  `)}
        </div>

          <form @submit=${this.sendMessage} class="input-area p-4 bg-base-200">
            <div class="flex gap-2">
              <input
                type="text"
                class="input input-bordered w-full"
                placeholder="Ask about GDP, CPI, earnings, macro trends..."
                .value=${this.input}
                @input=${(e: Event) => (this.input = (e.target as HTMLInputElement).value)}
              />
              <button class="btn btn-primary" ?disabled=${!this.input.trim()}>Send</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }
}

