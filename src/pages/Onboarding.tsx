<div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">🎉 Tudo pronto!</h3>
                      <p className="text-gray-300">
                        Seu nome de usuário foi configurado. Agora você pode acessar todas as funcionalidades do Nighshift.
                      </p>
                    </div>
                    <Button 
                      onClick={handleGoToDashboard}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 whitespace-nowrap"
                    >
                      Ir para o Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Menu de funcionalidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">O que você pode fazer</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors cursor-pointer ${
                  !usernameSaved ? 'opacity-60' : ''
                }`}
                onClick={() => {
                  if (!usernameSaved) {
                    showError('Primeiro salve seu nome de usuário!');
                  } else {
                    navigate('/dashboard');
                  }
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      usernameSaved
                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20' 
                        : 'bg-gray-700'
                    }`}>
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Mesas</h3>
                  <p className="text-sm text-gray-400">Gerencie suas mesas de RPG</p>
                  
                  {!usernameSaved && (
                    <div className="mt-4">
                      <span className="text-xs px-2 py-1 bg-yellow-700 rounded-full text-yellow-300">
                        Salve seu nome primeiro
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => showError('Funcionalidade em breve!')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <User className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Personagens</h3>
                  <p className="text-sm text-gray-400">Crie e gerencie seus personagens</p>
                  
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      Em breve
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="bg-gray-800/50 border-gray-700 opacity-60 cursor-not-allowed"
                onClick={() => showError('Funcionalidade em breve!')}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-gray-700">
                      <Gamepad2 className="h-6 w-6" />
                    </div>
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2">Sistemas</h3>
                  <p className="text-sm text-gray-400">Explore sistemas de RPG</p>
                  
                  <div className="mt-4">
                    <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                      Em breve
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instruções */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="pt-6">
              <h3 className="font-bold text-lg mb-4">📝 Como começar</h3>
              <ol className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</span>
                  <span>Defina seu nome de usuário acima e clique em "Salvar"</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-sm">2</span>
                  <span>Clique em "Ir para o Dashboard" para acessar suas mesas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-sm">3</span>
                  <span>Em breve: Crie personagens e explore sistemas de RPG</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;