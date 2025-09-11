import { Command } from '@oclif/core';
export default class Evolve extends Command {
    static description: string;
    static args: {
        projectName: import("@oclif/core/lib/interfaces/parser.js").Arg<string, Record<string, unknown>>;
    };
    static flags: {
        to: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        reason: import("@oclif/core/lib/interfaces/parser.js").OptionFlag<string, import("@oclif/core/lib/interfaces/parser.js").CustomOptions>;
        'sync-design': import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        'ai-optimize': import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        'preserve-code': import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        interactive: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<boolean>;
        help: import("@oclif/core/lib/interfaces/parser.js").BooleanFlag<void>;
    };
    run(): Promise<void>;
    private detectCurrentFramework;
}
//# sourceMappingURL=evolve.d.ts.map