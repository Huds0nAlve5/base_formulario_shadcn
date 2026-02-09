"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function Login() {
  return (
    <>
      <div className="bg-neutral-900 h-screen flex justify-center items-center">
        <Card className="w-100">
          <CardHeader>
            <CardTitle>Realizar login</CardTitle>
            <CardDescription>Forneça os dados de login e senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label htmlFor="email">E-mail</Label>
            <Input type="email" name="email" />
            <Label htmlFor="senha">Senha</Label>
            <Input type="password" name="senha" />
          </CardContent>
          <CardFooter>
            <Link className="w-full" href={"/home"}>
              <Button className="hover:cursor-pointer w-full" type="submit">
                Entrar
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
