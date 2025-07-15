declare module 'cookie' {
    interface CookieParseOptions {
        decode?(str: string): string;
    }

    interface CookieSerializeOptions {
        maxAge?: number;
        domain?: string;
        path?: string;
        expires?: Date;
        httpOnly?: boolean;
        secure?: boolean;
        priority?: 'low' | 'medium' | 'high';
        sameSite?: true | false | 'lax' | 'strict' | 'none';
        encode?(str: string): string;
    }

    export function parse(str: string, options?: CookieParseOptions): { [key: string]: string };
    export function serialize(name: string, val: string, options?: CookieSerializeOptions): string;
}
