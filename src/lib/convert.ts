type TJSON = {
  page: string;
  describe: string;
  duration: string;
  mode: string;
  time: number;
  flow: string[];
  executed: Record<string, boolean>;
  request: Record<string, object>;
  response: Record<string, object>;
};

export class E2EDisplay {
  constructor(private json: TJSON) {}

  public convert(): string {
    const head = 'sequenceDiagram\n';

    const lines = [];
    if(!this.json.flow){
        return ''
    }

    for (let i = 0; i < this.json.flow.length - 1; i++) {
      const flow = `${this.json.flow[i]}->>${this.json.flow[i + 1]}`;

      const executed = this.json.executed[this.json.flow[i]]? '✔️': '❌';
      lines.push(`${flow}: request${i + 1} ${executed}`);
    }

    return head + lines.join('\n');
  }
}
